<?php
	
?>

<!DOCTYPE html>
<html>
    <head>
       
        <title> Tsamid Admin </title>
		<link rel="stylesheet" type="text/css" href="static/css/style.css">
		<link rel="stylesheet" type="text/css" href="static/css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="static/css/bootstrap-theme.css">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js">
		<script src="static/js/bootstrap.js"></script>
		<script src="static/js/login.js"></script>
    </head>
    <body>
		<div class="wrapper">
			<div class="header">

			</div>
			<div class="login_form col-md-6 col-md-offset-5">
				<div class="input-group col-md-16">
					<input id="username" type="text" class="form-control" value="admin" placeholder="Username">
				</div>


				<div class="input-group col-md-16">
					<input id="password" type="password" class="form-control" value="admin" placeholder="Password">
				</div>
				<div class="buttons">
					<button type="button" class="btn btn-primary btn-lg col-md-7 " id="login">Login</button>
					<button type="button" class="btn btn-info btn-lg col-md-offset-2 col-md-7" id="signup">Signup</button>
				</div>
				<div class="alert alert-danger" id="userDetailsError"> Wrong User Name / Password .. Please try again</div>
			</div>
		</div>
    </body>
</html>
