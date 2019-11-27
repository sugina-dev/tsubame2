'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

function notify(str) {
	return `<!DOCTYPE html>
<html lang="en-HK" xml:lang="en-HK" dir="ltr">
<head>
<title>Success</title>
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

const content = fs.readFileSync('config.json');
const jsonContent = JSON.parse(content);
const defaultSecret = jsonContent.secret;
const defaultToken = jsonContent.token;

const app = express();
app.use(session({
	secret: defaultSecret,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	if (req.session.loggedin) {
		res.setHeader('Content-Type', 'text/html');
		res.send(notify('<p>Log in success!</p><p><a href="logout">Log out</a>.</p>'));
	} else {
		res.status(403);
		res.setHeader('Content-Type', 'text/html');
		res.send(notify('<p>Log in failed!</p><p>Go to the <a href="login">log in page</a>.</p>'));
	}
});

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login', (req, res) => {
	const token = req.body.token;
	if (token == defaultToken) {
		req.session.loggedin = true;
		req.session.username = 'username';
	}
	res.redirect('.');
	res.end();
});

app.get('/logout', (req, res) => {
	req.session.destroy(err => {
		if (err) {
			console.log(err);
			res.status(500);
			res.setHeader('Content-Type', 'text/html');
			res.send(notify('<p>An error occurred!</p>'));
		} else {
			res.redirect('.');
		}
	});
}); 

app.listen(3000, 'localhost');
