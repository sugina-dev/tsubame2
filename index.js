'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

function notify(title, str) {
	return `<!DOCTYPE html>
<html lang="en-HK" xml:lang="en-HK" dir="ltr">
<head>
<title>` + title + `</title>
<meta charset="UTF-8"/>
<style> html { align-items: center; background-color: #eee; display: flex; height: 100%; justify-content: center; }
body { background-color: #ddd; border: 1px solid black; border-radius: 0.75rem; font-family: sans-serif, sans-serif; padding: 0.5em 7em 0.5em 3em; }
a { color: dodgerblue; text-decoration: none; }
a:hover { color: deeppink; }
</style>
</head>
<body>` + str + `</body>
</html>`;
}

const config = fs.readFileSync('config.json');
const jsonConfig = JSON.parse(config);
const defaultSecret = jsonConfig.secret;
const defaultToken = jsonConfig.token;

const app = express();
app.use(session({
	secret: defaultSecret,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	if (!req.session.authenticated) {
		res.status(403);
		res.setHeader('Content-Type', 'text/html');
		res.send(notify('Login Form', `<form action="login" method="POST">
<p>Token: <input type="password" name="token" required /></p>
<p><input type="submit" value="Login"></p>
</form>`));
	} else {
		res.setHeader('Content-Type', 'text/html');
		res.send(notify('Success', '<p>Log in success!</p><p><a href="logout">Log out</a>.</p>'));
	}
});

app.post('/login', (req, res) => {
	const token = req.body.token;
	if (token == defaultToken) {
		req.session.authenticated = true;
		res.redirect('/');
	}
	res.redirect('.');
});

app.get('/logout', (req, res) => {
	if (!req.session.authenticated) {
		res.status(400);
		res.setHeader('Content-Type', 'text/html');
		res.send(notify('Error', '<p>You are not logged in!</p>'));
	} else {
		req.session.destroy(err => {
			if (err) {
				res.status(500);
				res.setHeader('Content-Type', 'text/html');
				res.send(notify('Error', '<p>An error occurred!</p>'));
			} else {
				res.redirect('.');
			}
		});
	}
});

app.use((req, res) => {
	res.status(404).redirect('/');
});

app.listen(3000, 'localhost');
