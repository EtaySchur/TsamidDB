/**
*	Parse Manager Class - Handles all Parse Admin Actions
*/


var ParseManager = function() {
	this._currentUser;
};

ParseManager.CurrentUser = function(currentUser){
	this._userName = currentUser.attributes.username;
	this._userEmail = currentUser.attributes.email;
	this._parseUserObject = currentUser;
}


ParseManager.CurrentUser.prototype.getCurrentUserName = function (){
	return this._userName;
};

ParseManager.CurrentUser.prototype.getCurrentUserEmail = function (){
	return this._userEmail;
};

ParseManager.CurrentUser.prototype.getCurrentParseUser = function (){
	return this._parseUserObject;
};

ParseManager.prototype.getCurrentUser = function (){
	return this._currentUser;
};

ParseManager.prototype.setCurrentUser = function (currentUser){
	this._currentUser = currentUser;
};

ParseManager.prototype.deleteObject = function (callback , parseObject){
	$('body').css('cursor' , 'progress');  
	parseObject.destroy({
  		success: function(myObject) {
    		callback(true);
    		$('body').css('cursor' , 'default');
  	},
  		error: function(myObject, error) {
    	    callback(error);
    	    $('body').css('cursor' , 'default');
  	}
});
};


ParseManager.prototype.createParseObject = function (tableName) {
		var table = Parse.Object.extend(tableName);
		object = new table();
		return object;
	
};

ParseManager.prototype.saveObject = function (callback , tableName , object) {
	$('body').css('cursor' , 'progress');  

	// case not a Parse Object
	if(!object.id){
				  console.log('not parse object');
				  var resultArray = [];
				  // Create parse object
                  parseObject = parseManager.createParseObject(tableName);
                  for(detail in object){
                    parseObject.set(detail , object[detail]);
                  }
                  resultArray.push(parseObject);
                  alertText = 'New Object Saved';

     }else{
                    parseObject = object;
                    for(detail in object.attributes){
                        parseObject.set(detail , object.attributes[detail]); 
                    }
                    alertText = 'Edit Object';
                }
                parseObject.save().then(function (success) {
                  successAlert = new Alert('success' , alertText+' Success');
                  successAlert.start();
                  $('body').css('cursor' , 'default');
                  callback(success);
                }
                , function (error){
                      failAlert = new Alert('danger' , alertText+' Fail');
                      failAlert.start();
                      console.log("Error: " + error.description);
                      $('body').css('cursor' , 'default');
                      callback(error);
                });
	};




/**
*	Admin Log In function
*
*	@params : @callback - returned callback with the results
*			  @username - filled current user name
*			  @password - filled current user password
*/

ParseManager.prototype.adminLogIn = function (callback , username , password){
	  $('body').css('cursor', 'progress'); 	
      Parse.User.logIn( username, password , null).then(
      function(user) {
      	// Setting user details in ParseManager
      	console.log('entering current user to model');
      	
      },
      function(error) {
      	$('body').css('cursor', 'default'); 
        callback(error);
      }).then(
          function(user) {
          Parse.User.current().set("isOnline", true, null); // Setting the user as logged in in the DB
          Parse.User.current().save().then(
                    function(user) {
                      console.log(user.get("username") + " logged in.");
                      $('body').css('cursor', 'default'); 
                      callback(user);
      });
  });
};



/**
*	Generic Parse Object Query function
*
*	@params : @callback - returned callback with the results
*			  @tableName - requiered Parse Table
*			  @objectId  - requiered Parse ObjectId , get NULL for all objects.
*/

ParseManager.prototype.getParseObject = function ( callback , tableName , colName , object  ){
	 $('body').css('cursor', 'progress');
	 var table = Parse.Object.extend(tableName);
	 var query = new Parse.Query(table);
	 if(colName){
	 		query.equalTo( colName , object );
	 		query.find({
  				success: function(results) {
    				$('body').css('cursor', 'default'); 
				   	callback(results);
				  },
				  error: function(error) {
				  	$('body').css('cursor', 'default'); 
				    callback(error);
				  }
				});
	 }else{
	 	query.find().then(
            function(results) {
              console.log('Query is OK')
              console.log(results);
              $('body').css('cursor', 'default'); 
              callback(results);
            },
            function(error) {
              console.log('Query Failed')
              $('body').css('cursor', 'default'); 
              callback(error);
            });
	 }
};

ParseManager.prototype.getParseObjectById = function ( callback , tableName , colName , objectId , pointerCol  ){
	 $('body').css('cursor', 'progress');
	 var table = Parse.Object.extend(tableName);
	 var query = new Parse.Query(table);
	 query.include(pointerCol);
	 if(colName){
	 		query.equalTo( colName , objectId );
	 		query.find({
  				success: function(results) {
    				$('body').css('cursor', 'default'); 
				   	callback(results);
				  },
				  error: function(error) {
				  	$('body').css('cursor', 'default'); 
				    callback(error);
				  }
				});
	 }else{
	 	query.find().then(
            function(results) {
              console.log('Query is OK')
              console.log(results);
              $('body').css('cursor', 'default'); 
              callback(results);
            },
            function(error) {
              console.log('Query Failed')
              $('body').css('cursor', 'default'); 
              callback(error);
            });
	 }
};


function editUser(user){

	var UserTable = Parse.Object.extend("_User");
	var query = new Parse.Query(UserTable);
	id = user.id;
	console.log(user.id);
	query.equalTo("objectId" , id);
	query.find({
 		 success: function(results) {
   			
    // Do something with the returned Parse.Object values
    		for (var i = 0; i < results.length; i++) {
	
			      var object = results[i];
			      console.log(user.attributes.username);
			 	  object.set("username" , user.attributes.username);
			 	  object.save();
			 	  return true;

    			}
 		 },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});

};