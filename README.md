# Setup Box app users with Auth0
This configuration will allow you to use Auth0 as the identity management solution for an demo application that use Box app users to login to Box. This will allow a user to register an email with Auth0 and this will automatically create a Box app user and map it to the Auth0 user. The app itself consists of a Box UI Element loaded as the app user logged in. 


See the below diagrams for details

Registration flow

<img src="/public/img/register.png" width="90%" height="90%">
        
Login flow

<img src="/public/img/login.png" width="90%" height="90%">


## Pre-requisites
You will need both a Auth0 free developer account and a Box account
- Free Auth0 Dev account: https://auth0.com/signup?place=header&type=button&text=sign%20up
- Free Box Developer account: https://account.box.com/signup/developer

## Auth0

1. Create a new application
    Choose 'Regular Web Applications'
  
    Give a name like 'box-auth0-demo' or similar
  
    After creation, go to 'Settings'

2. Set allowed URLs
  
    Add 'http://localhost:3000/callback' to the 'Allowed Callback URLs'
  
    Add 'http://localhost:3000' to the 'Allowed Logout URLs'
  
    Save changes

## Box

1. Create a new JWT Application https://developer.box.com/guides/authentication/jwt/jwt-setup/
  - App access level: App access only
  - Application scopes: Read, Write, Manage users, Manage groups
  - Advanced features: Generate user access tokens
  - CORS Domains: http://localhost:3000 

2. Download the json file with the private key
   This will be downloaded as json file with 12 lines. Remove all line ending to make it a single line
  
    From

    <img src="/images/multi.png" width="50%" height="50%">

    
    To
    
    <img src="/images/single.png" width="50%" height="50%">

## Setup and run the app

1. Clone this repository and create an '.env' file in the root and add the following key/value pair
  -  AUTH0_CLIENT_ID=..from the settings page of your Auth0 app
  -  AUTH0_DOMAIN=..from the settings page of your Auth0 app
  -  AUTH0_CLIENT_SECRET=....from the settings page of your Auth0 app
  -  SESSION_SECRET=..random string 
  -  AUTH0_CALLBACK_URL=http://localhost:3000/callback
  -  BOX_JWT=..jwt json config in a single line

2. Install dependencies

    npm install

3. Run the app

    npm start

    This should bring up this website on localhost:3000 and you can go through the registration process
  
    Welcome screen
    
    <img src="/images/screen.png" width="100%" height="100%">
    
    Registration (sign up)
    
    <img src="/images/register.png" width="50%" height="50%">
    
    User mapping info
    
    <img src="/images/loggedin.png" width="100%" height="100%">    
    
    Folder created as the app user
    
    <img src="/images/folder.png" width="100%" height="100%">
    
    
# License
The MIT License (MIT)

Copyright (c) 2021 Peter Christensen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

