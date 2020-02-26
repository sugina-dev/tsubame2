# Tsubame 2

New server for the new Sugina Development Group website that performs authentication

The server listens on `localhost:3000`.

* GET `/`
    - Returns 200 if the user has logged in
    - Returns 403 if the user is not logged in, and show the log in form
* POST `/login`: Log in, `token`
* POST `/logout`: Log out

All 404 pages are redirected to `/`.

## Usage

Set environment vairable `NODE_SECRET` and `NODE_TOKEN`.

Run `node index.js`.
