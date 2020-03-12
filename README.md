# Tsubame 2

New server for the new Sugina Development Group website that performs authentication

## API

* GET `/`
    - Returns 200 if the user has logged in
    - Returns 403 if the user is not logged in, and show the log in form
* POST `/login`: Log in, `token`
* POST `/logout`: Log out

All 404 pages are redirected to `/`.

## Usage

```sh
$ docker run -d -p '[::1]:3000:3000' -e NODE_SECRET='xxx' -e NODE_TOKEN='xxx' --name=my-tsubame2 tsubame2
```

The server listens on port `3000`.
