# React and Flask Keylogger App

This Proof-of-Concept application will allow a user to create Cross-Site Scripting (XSS) payloads for recording keystrokes, as well as view logs of recorded keystrokes sent from vulnerable web applications with the payload running.

## Flask Server Setup

In `server`, run `bash run.sh` to set up and run the server.

## React Client Setup

In `client`, run `npm install` then `npm run dev` to get the frontend installed and running.

## Basic App Usage

You will need to register a username and password at `/register`.  Then login at `/login` with the account you created.

Here, there are currently three pages, `Logs`, `Payloads`, and `Settings`.  You can create XSS payloads in the `Payloads` page that will log keystrokes in a vulnerable application, as well as grab cookies, local storage, and session storage, and then send them back to the server.  Then this information can be viewed in the `Logs` page.

## Logs Page

The Logs page is where you can view recorded keystrokes sent from a XSS payload to the server.  Each log will display the host, time of log, User Agent, keystrokes, cookies, and storage data (local and session storage).  You can filter by host or a search term, which will search through the keystrokes, cookies, local storage, and session storage data.

You can also click a row to view the keystrokes, cookies, and local and session storage data in a modal.  There's an option to process keystrokes, where `ENTER` characters will be converted to newlines, and for each `BACKSPACE`, a character will be deleted.  Below you can see an example of keystrokes before they've been processed and after.

<p float="left">
    <img src="./images/unprocessed_keystrokes.png" alt= “” height="250px">
    <img src="./images/processed_keystrokes.png" alt= “” height="250px">
</p>

## Payloads Page

Here you can create and edit XSS payloads to use with the application.  A `Default XSS Payload` payload is included as an example.

The JavaScript payload will need to record keystrokes into an array, stringify the array, base64 encode it, then set the base64 string as the value to a key `keystrokes` in a JSON blob.  This will then need to be sent to `/api/logs` as a POST request to wherever the server is hosted.

To send cookies, base64 encode `document.cookie`, and to send local and session storage, stringify and base64 encode each.

Below is an example of what the data should look like when the script sends the recorded data to the server:
```
{
    "cookies": "dGVzdD10ZXN0OyB0ZXN0Mj1oYWtrZA==",  // decoded: 'test=test; test2=hakkd'
    "keystrokes": "WyJ0IiwiZSIsInMiLCJ0Il0=",       // decoded: '["t","e","s","t"]'
    "localStorage": "eyJ0ZXN0IjoidGVzdCJ9",         // decoded: '{"test":"test"}'
    "sessionStorage": "eyJ0ZXN0IjoidGVzdCJ9"        // decoded: '{"test":"test"}'
}
```

## Settings Page

The Settings page allows you to toggle between dark and light mode, as well as change your password.

## Disclaimer

This application is only intended for legal activities and educational purposes.  The author assumes no responsibility for any illegal use of this tool or any damage caused by this application.
