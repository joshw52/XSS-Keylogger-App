# React and Flask Keylogger App

This Proof-of-Concept application will allow a user to create XSS payloads for recording keystrokes, as well as view logs of recorded keystrokes sent from vulnerable web applications with the payload running.

## Flask Server Setup

In `server`, run `bash run.sh` to set up and run the server.

## React Client Setup

In `client`, run `npm install` then `npm run dev` to get the frontend installed and running.

## Basic App Usage

You will need to register a username and password at `/register`.  Then login at `/login` with the account you created.

Here, there are currently three pages, `Logs`, `Payloads`, and `Settings`.  You can create Cross-Site Scripting payloads that will log keystrokes in the vulnerable page, as well as grab cookies, local storage, and session storage, and then send them back to the server.  Then you can view this information in the `Logs` page.

## Logs Page

View recorded keystrokes sent from a XSS payload to the server.  Each log will display the host, time of log, User Agent, keystrokes, cookies, and storage data (local and session storage).  You can filter by host or a search term, which will search through the keystrokes, cookies, local storage, and session storage data.

You can also click a row to view all of the keystrokes in a modal.  There's an option to process keystrokes, where `ENTER` characters will be converted to newlines, and for each `BACKSPACE`, a character will be deleted.  Below you can see an example of before processing keystrokes (left) and after (right).

<p float="left">
    <img src="./images/unprocessed_keystrokes.png" alt= “” height="300px">
    <img src="./images/processed_keystrokes.png" alt= “” height="300px">
</p>

## Payloads Page

Here you can create and edit XSS payloads to use with the application.  A `Default XSS Payload` payload is included as an example.

The JavaScript payload will need to record keystrokes into an array, stringify the data, base64 encode it, then set the base64 string as the value to a key `keystrokes` in a JSON blob.  This will then need to be sent to `/api/logs` as a POST request to wherever the server is hosted.

## Settings Page

The Settings page allows you to toggle between dark and light mode, as well as change your password.

## Disclaimer

This application is only intended for legal activities and educational purposes.  The author assumes no responsibility for any illegal use of this tool or any damage caused by this application.
