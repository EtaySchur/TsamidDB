<?php
/*
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
include_once "templates/base.php";
session_start();

set_include_path("src/" . PATH_SEPARATOR . get_include_path());
require_once 'Google/Client.php';
require_once 'Google/Service/Urlshortener.php';
require_once 'Google/Service/Plus.php';

/************************************************
  ATTENTION: Fill in these values! Make sure
  the redirect URI is to this page, e.g:
  http://localhost:8080/user-example.php
 ************************************************/
 $client_id = '929183822302-1uci18s700c7sq3062gg85vopep2ione.apps.googleusercontent.com';
 $client_secret = 'T54a4Vc2W58INeJ8g8Z1r76s';
 $redirect_uri = 'http://localhost/~etayschur/tsamidBack/index.php';

/************************************************
  Make an API request on behalf of a user. In
  this case we need to have a valid OAuth 2.0
  token for the user, so we need to send them
  through a login flow. To do this we need some
  information from our API console project.
 ************************************************/
$client = new Google_Client();
$client->setClientId($client_id);
$client->setClientSecret($client_secret);
$client->setRedirectUri($redirect_uri);

// add the wanted services to request
$client->addScope("https://www.googleapis.com/auth/userinfo.profile");
$client->addScope("https://www.googleapis.com/auth/userinfo.email");
$plus = new Google_Service_Plus($client);



/************************************************
  When we create the service here, we pass the
  client to it. The client then queries the service
  for the required scopes, and uses that when
  generating the authentication URL later.
 ************************************************/
$service = new Google_Service_Urlshortener($client);

/************************************************
  If we're logging out we just need to clear our
  local access token in this case
 ************************************************/
if (isset($_REQUEST['logout'])) {
  unset($_SESSION['access_token']);
}

/************************************************
  If we have a code back from the OAuth 2.0 flow,
  we need to exchange that with the authenticate()
  function. We store the resultant access token
  bundle in the session, and redirect to ourself.
 ************************************************/
if (isset($_GET['code'])) {
  $client->authenticate($_GET['code']);
  $_SESSION['access_token'] = $client->getAccessToken();
  $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
  header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
}

/************************************************
  If we have an access token, we can make
  requests, else we generate an authentication URL.
 ************************************************/
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
  $client->setAccessToken($_SESSION['access_token']);
} else {
  $authUrl = $client->createAuthUrl();
}

/************************************************
  If we're signed in and have a request to shorten
  a URL, then we create a new URL object, set the
  unshortened URL, and call the 'insert' method on
  the 'url' resource. Note that we re-store the
  access_token bundle, just in case anything
  changed during the request - the main thing that
  might happen here is the access token itself is
  refreshed if the application has offline access.
 ************************************************/
if ($client->getAccessToken() && isset($_GET['url'])) {
  $url = new Google_Service_Urlshortener_Url();
  $url->longUrl = $_GET['url'];
  $short = $service->url->insert($url);
  $_SESSION['access_token'] = $client->getAccessToken();
}

?>



<!doctype html>
<html lang="en" ng-app="myApp" ng-controller="MainController">
<head>
  <meta charset="UTF-8">
  <title>Angular Management</title>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"> 
  </script>
  <script src="http://www.parsecdn.com/js/parse-1.2.15.min.js"></script>
  <script src="static/js/alerts.js"></script>
  <script src="static/js/parse.js"></script>
  <script src="static/js/parse_admin.js"></script>
  <script src="static/js/bootstrap.js"></script>
  <script src="static/js/angular.min.js"></script>
  <script src="static/js/angular-route.min.js"></script>
  <script src="static/js/app.js"></script>
  <script src="static/js/controllers.js"></script>
  <script src="static/js/jquery.bootstrap-duallistbox.js"></script>
  <link rel="stylesheet" href="static/css/bootstrap-duallistbox.css">
  <link rel="stylesheet" href="static/css/zocial.css">
  <link rel="stylesheet" href="static/css/style.css">
  <link rel="stylesheet"  href="static/css/bootstrap.css">
  <link rel="stylesheet"  href="static/css/bootstrap-theme.css">

</head>
<body>
<div class="box">
  <div class="request">
    <?php if (isset($authUrl)): ?>
      <a class='g-signin zocial googleplus' href='<?php echo $authUrl; ?>'>Sign In</a>
    <?php else: ?>
     
    <?php endif ?>
  </div>
</div>
  <div> <? 
   if (isset($_SESSION['access_token'])) {
    $me = $plus->people->get("me");
      ?> 
        <div class="wrapper">
            <div class="header col-md-16">
           <!--  <h1 class="col-md-8 col-md-offset-4" id="admin_title"> Tsamid Admin App </h1> -->
              <ul class="nav nav-pills col-md-12" id="admin_top_menu">
                <li ng-click="initVars()" ng-class="{ active: isActive('/Lessons_Manage') }" class="menu_category col-md-3"><a href="#/Lessons_Manage">Manage Lessons</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Users_Manage') }" class="menu_category col-md-3" id="manage_users"><a href="#/Users_Manage">Manage Users</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Games_Manage') }" class="menu_category col-md-3" id="manage_games"><a href="#/Games_Manage">Games Zone</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Groups_Manage') }" class="menu_category col-md-3" id="manage_groups"><a href="#/Groups_Manage">Manage Groups</a></li>
                <li ng-click="initVars()" ng-class="{ active: isActive('/Content_Manage') }" class="menu_category col-md-3" id="manage_content"><a href="#/Content_Manage">Manage Content</a></li>
              </ul>
            <div class="col-md-3">Logged in as : {{currentUser.attributes.username}}  </div>
             <a class='logout btn btn-danger col-md-1' href='?logout'> LogOut</a>
        
       <!-- <div class="col-md-4">Logged in as : <? //echo $_SESSION['user_info']->username; ?>  </div> -->
      </div>
      <div class="main" ng-view></div>
      <div class="alert_section col-md-14 col-md-offset-1"> <div>
      </div>
    </div>
      <?

    }else{
      ?> <div> Please Log In </div>
           <?
    }
    ?>
  </div>
</body>
</html>