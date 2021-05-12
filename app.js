// index.js

/**
 * Required External Modules
 */

require('dotenv').config()

const jwtDecode = require('jwt-decode');

var bodyParser = require('body-parser');

var BoxSDK = require('box-node-sdk');

const express = require('express');

var fs = require('fs');
const path = require('path');

var http = require("https");

var util = require('util');

var request = require('request');
const querystring = require("querystring");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const boxAppSettings ={
  "boxAppSettings": {
    "clientID": "16y3foluw9j45cejdny8dcn99tdigw5r",
    "clientSecret": "ca8dqxTec7GzwcCNGFV0JMIYkATaqYy3",
    "appAuth": {
      "publicKeyID": "b71o3jh9",
      "privateKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQII7MT7ZaOi6gCAggA\nMBQGCCqGSIb3DQMHBAhQmOn6CpZ9gQSCBMhBKQiqPdFzLdy9Ii2j4VuVb/PoLmGq\n3Vmg4X0WWdiRDq8TEgU+Kgtm2Lhk8PcD4X3o6JOsLmPu8pZryVpCbnrT6Qc9yB4y\nBejQ3aedNKUEJ9p7IfC5j7OmRDIc55WLJYElmqJeHJjGutQf7ynNQ5xvnoZG8WpW\nyfZPw+Pijhjd247kqBYTFqhOkyl4Eo5QVuBVLTmYOO98cQGY+Mb1Bc1O9EhGfXiQ\nO/szxuofInCtjzqadLOyBma34Se+Hj18qOfweLGFjqVWPDis5YeTP6n+qb0TEdyr\nQQ+wBlLlVmnv+KAzwh+GJ08Y/FFomxWKGkuz7e6vlPnjAOEtmFisdiYBbUXDitQy\nJig0oyAXyhMG74pdCs5cWF8Fc38BfXtBZ9By812GpZl4SAw66Q1LSvClnC8FFbZp\ny1TJkjC7eJkcGo8oXXBqskGiIKjQGkbBQW1BR9FfwFUJatYkXpBfnmTSbA/0/aam\nTMTXQaTNvVRjgAg18xAiucUdIjSoIxA8H1dXXQGE/nJ1sb+3sywunGw5Bd9y8aNF\nE2F24JugAUKUDEj3lRZOSifIn3vD+wJOt1FIZZ1XSnSBvF5o5yPYrezTomMYfAa9\ntZaRze10R+65yAJv8z7hxeEfTXLK4rsyBe7J666sWgKW/VEiaiVzVkXJTIBUwwhg\nVSQlQxQ7A9VtHnJKcR0mBDi/OVeGGUwqmcS/crUDdlhq1T8GzU9m4kUun7RxrXt2\nwHCvV/3CX7fCpkgxal51TJ0+frsoyb1y8nN9kPCq3n8MHlfGTnfXYy4/oobVR4sZ\nve4OK72C11F3JVm/QcSHXhgPoWeDIrW6PGr5Wm7bWLXTELr+J+zhXPtslbKWO1J2\nbhJQe/viKRNt0QXEY6r+Ne7Cuh447ZScQtWu6i4kTXndhYfrq2uRaf9I6n1YD3Wq\nA6edqVZoL8fjraHkGNuoUZ0dSGLgzmlSDB0kKELdWuQeLUeESuWqg2J8rN8jNCPu\ne6SLx2umWPuqwHutB1404/IiC3LJDtXg/WXE8ydExb2ACS0p5J+HDTkyPHb/Gs4n\nDy6PEMnwkq+Mq2NOOGGGZOU4heVBDhEGpEG4Z1qOoWvYYkzRV7d3MM3CFZ/ElbB7\nGNG4ed14HDLLsBcsWg5LnSdTr6fjOyVM29ev10P8MqaJawwBB6sLeUyGUEsSPpwu\n1bjuuLioUITo51Bn6X5LTVkhHrrp9OTg03Klh1cPWVVOtSjXQFt8aXEIXbmPq8O+\n8FJJO5hXX/CSnC6NLYoI3rcnAhY0RFVtBZkYtYrav1N9U35dkbInaYJ4lkEgn7Hs\ngg0fG/TbPGyO0Jmj8EpwrRcyBxcpfpsymszb4zDX0nOpXSLRqslhqNrXjcdlgT7v\nr03QdSUTbaKrM97AM76ao05uN3+MGOlYsP0SMBeqjoWWb0kKNizsF8LWw0EXzA3M\nKI0zv6u+JzrRMQSbD5QMoIZRoZJ2eTcO86DYGBDDpFfQbAuX9VMJw31PIKmnb+3M\n43VNHkFC/LJl5PSU4+6GEfPGb6fb9/Kx1niXtLf6Qt//offwBZOjoGxKzGyYcKtd\naZXk0slwjDianjaFg7Hs1ONDfYvOrsF/loFTHqEQbdzEbJ6txfB49+bJB62B/u3q\nIVk=\n-----END ENCRYPTED PRIVATE KEY-----\n",
      "passphrase": "ee7829475047aa584715b5a4b26db64e"
    }
  },
  "enterpriseID": "47757585"
}

let serviceAccountClient;

console.log("Using config file...");
let boxSession = BoxSDK.getPreconfiguredInstance(boxAppSettings);
serviceAccountClient = boxSession.getAppAuthClient('enterprise');


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
const strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL
	},
	function (accessToken, refreshToken, extraParams, profile, done) {
	  /**
	   * Access tokens are used to authorize users to an API
	   * (resource server)
	   * accessToken is the token to call the Auth0 API
	   * or a secured third-party API
	   * extraParams.id_token has the JSON Web Token
	   * profile has all the information from the user
	   */
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'));
app.listen(port, function () {
	console.log('App listening on port ' + port + '...');
})
app.use(expressSession({
	secret: 'cat',
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
  let auth0Id= req.body.userId;
	getAppUserID(auth0Id)
		.then((appUserID) => {
			//If the box user is not present in AZURE, throw error
			if (!appUserID || appUserID=='NOTFOUND') {
				res.json({error: "some error"});
			}
			else {
				console.log(`App User ID is: ${appUserID.id}`);
				boxSession.getAppUserTokens(appUserID.id).then(function(accessToken) {
					console.log("the access token is: " + accessToken);
					res.json({
         				accessToken: accessToken.accessToken,
						auth0Id:auth0Id,
						userName:appUserID.name,
						login:appUserID.login,
						extId:appUserID.extId,
						boxId:appUserID.id
          });
				})
			}
		})

});
app.get('/auth0.js', function(req, res) {
	res.render('auth0', { user: req.user });
  });
  
app.get('/', function(req, res) {
  console.log(req.session);
  res.render('index', { user: req.user });
});
app.get("/login", passport.authenticate("auth0", {
	scope: "openid email profile"
}),
	(req, res) => {
		
    console.log("REQ:" + req);
    console.log('Login was called in the Sample');
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
			console.log('We received a return from Auth0. - create here!' + JSON.stringify(user));
			getAppUserID(user.user_id).then((appuserId) => {
				if(appuserId=='NOTFOUND') {
					createAppUser(user.user_id,user.user_name).then((appUserID) => {
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



/**
 *  App Configuration
 */

/**
 * Routes Definitions
 */

/**
 * Server Activation
 */

const createAppUser = (auth0Id,name) =>   {
  console.log(auth0Id + ":" + name);
  return serviceAccountClient.enterprise.addAppUser(name, { "is_platform_access_only": true,"external_app_user_id":auth0Id }).then((result) => {
    console.log(result);
      
        return result.id;
      }
    );
}
const getAppUserID = (auth0Id) => {
  console.log("Finding extID:" + auth0Id);
  return serviceAccountClient.enterprise.getUsers({ "external_app_user_id": auth0Id,"fields":"id,name,login,external_app_user_id" })
      .then((result) => {
          console.log(result);
          if (result.total_count > 0) {
            return {id:result.entries[0].id,name:result.entries[0].name,login:result.entries[0].login,extId:result.entries[0].external_app_user_id};
          }
          else {
            return "NOTFOUND";
          }
      });
}