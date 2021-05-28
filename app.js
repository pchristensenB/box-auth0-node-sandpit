

require('dotenv').config()

const jwtDecode = require('jwt-decode');

const bodyParser = require('body-parser');

const BoxSDK = require('box-node-sdk');

const express = require('express');

const fs = require('fs');
const path = require('path');

const http = require("https");

const util = require('util');

const request = require('request');
const querystring = require("querystring");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const boxAppSettings = process.env.BOX_JWT;


console.log("Using config file...");
let boxSession = BoxSDK.getPreconfiguredInstance(JSON.parse(boxAppSettings));
let serviceAccountClient = boxSession.getAppAuthClient('enterprise');


/**
 * Session
 */

const session = {
	secret: process.env.SESSION_SECRET,
	cookie: {},
	resave: false,
	saveUninitialized: false
};
/**
 * Passport
 */
const strategy = new Auth0Strategy({
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL
	},
	function (accessToken, refreshToken, extraParams, profile, done) {
		return done(null, profile);
	}
);
/**
 * App Variables
 */

const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'));
app.listen(port, function () {
	console.log('App listening on port ' + port + '...');
})
app.use(expressSession({
	secret: 'box',
	cookie: {},
	resave: false,
	saveUninitialized: false
}));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.post('/boxUI', function (req, res) {
	console.log("tok:" + req.session);
	let auth0Id = req.body.userId;
	getAppUserID(auth0Id)
		.then((appUserID) => {
			//If the box user is not present in auth0 at this point, throw error - user should have been created
			if (!appUserID || appUserID == 'NOTFOUND') {
				res.json({ error: "some error involving app user not found" });
			}
			else {
				console.log(`App User ID is: ${appUserID.id}`);
				boxSession.getAppUserTokens(appUserID.id).then(function (accessToken) {
					console.log("the access token is: " + accessToken);
					res.json({
						accessToken: accessToken.accessToken,
						auth0Id: auth0Id,
						userName: appUserID.name,
						login: appUserID.login,
						extId: appUserID.extId,
						boxId: appUserID.id
					});
				})
			}
		})

});
app.get('/auth0.js', function (req, res) {
	res.render('auth0', { user: req.user });
});

app.get('/', function (req, res) {
	console.log(req.session);
	res.render('index', { user: req.user });
});
app.get("/login", passport.authenticate("auth0", {
	scope: "openid email profile"
}),
	(req, res) => {
		res.redirect('/');
	}
);
app.get("/callback", (req, res, next) => {
	passport.authenticate("auth0", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect("/login");
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			const returnTo = req.session.returnTo;
			delete req.session.returnTo;
			console.log('We received a return from Auth0. - create here if not found -> lazy instantiation' + JSON.stringify(user));
			getAppUserID(user.user_id).then((appuserId) => {
				if (appuserId == 'NOTFOUND') {
					createAppUser(user.user_id, user.user_name).then((appUserID) => {
						console.log("created:" + appUserID);
						res.redirect('/');
					})
				}
				else {
					console.log("found:" + appuserId);
					res.redirect('/');
				}
			});
		});
	})(req, res, next);
});

app.get("/logout", (req, res) => {
	req.logOut();

	let returnTo = req.protocol + "://" + req.hostname;
	const port = req.connection.localPort;

	if (port !== undefined && port !== 80 && port !== 443) {
		returnTo =
			process.env.NODE_ENV === "production"
				? `${returnTo}/`
				: `${returnTo}:${port}/`;
	}

	const logoutURL = new URL(
		`https://${process.env.AUTH0_DOMAIN}/v2/logout`
	);

	const searchString = querystring.stringify({
		client_id: process.env.AUTH0_CLIENT_ID,
		returnTo: returnTo
	});
	logoutURL.search = searchString;

	res.redirect(logoutURL);
});
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Creates the app user
const createAppUser = (auth0Id, name) => {
	console.log(auth0Id + ":" + name);
	return serviceAccountClient.enterprise.addAppUser(name, { "is_platform_access_only": true, "external_app_user_id": auth0Id }).then((result) => {
		console.log(result);

		return result.id;
	}
	);
}
//Finds  the app user - although it can only return a single record it still returns an array
const getAppUserID = (auth0Id) => {
	console.log("Finding extID:" + auth0Id);
	return serviceAccountClient.enterprise.getUsers({ "external_app_user_id": auth0Id, "fields": "id,name,login,external_app_user_id" })
		.then((result) => {
			console.log(result);
			if (result.total_count > 0) {
				return { id: result.entries[0].id, name: result.entries[0].name, login: result.entries[0].login, extId: result.entries[0].external_app_user_id };
			}
			else {
				return "NOTFOUND";
			}
		});
}