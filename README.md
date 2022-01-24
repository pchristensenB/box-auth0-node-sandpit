## Setup Box app users with Auth0

# Pre-requisites
You will need both a Auth0 free developer account and a Box account
- Free Auth0 Dev account: https://auth0.com/signup?place=header&type=button&text=sign%20up
- Free Box Developer account: https://account.box.com/signup/developer

# Auth0

1. Create a new application
  -  Choose 'Regular Web Applications'
  -  Give a name like 'box-auth0-demo' or similar
  -  After creation, go to 'Settings'

2. Set allowed URLs
  - Add 'http://localhost:3000/callback' to the 'Allowed Callback URLs'
  - Add 'http://localhost:3000' to the 'Allowed Logout URLs'
  - Save changes

# Box

1. Create a new JWT Application https://developer.box.com/guides/authentication/jwt/jwt-setup/
2. Download the json file with the private key
  - This will be downloaded as json file with 12 lines. Remove all line ending to make it a single line
  
    From

    ![multi](/images/multi.png)
    
    To
    
    ![single](/images/single.png)

# Setup and run the app

1. Clone this repository and create an '.env' file in the root and add the following key/value pair
  -  AUTH0_CLIENT_ID=..from the settings page of your Auth0 app
  -  AUTH0_DOMAIN=..from the settings page of your Auth0 app
  -  AUTH0_CLIENT_SECRET=....from the settings page of your Auth0 app
  -  SESSION_SECRET=..random string 
  -  AUTH0_CALLBACK_URL=http://localhost:3000/callback
  -  BOX_JWT=..jwt json config in a single line

2. Install dependencies
  - npm install

3. Run the app
  - npm start
  This should bring up this website on localhost:3000
  
  ![screen](/images/screen.png)


