Parse.initialize("hCiKNPSGy9q5iT40j0d9DAiLHpavkJMWxmsC15tS", "TmiPKzW632NWSIkuBB0Yj4HzYR4sJTba04k3iA8F");

var GLOBAL_PREFIX = ""; //  -> "//yuvalmit.appspot.com/static/"

// Local paths
var LOCAL_FOOD_PATH = "assets/images/myZonePage/";
var LOCAL_BADGE_PATH = "assets/images/badges/";
var LOCAL_AVATAR_PATH = "assets/images/avatarImages/";
var LOCAL_FULL_AVATAR_PATH = "assets/images/fullAvatarImages/";

/**
* Signup function for new users
*/
function signUp (callback, username, password, email, gender) {
	var user = new Parse.User();
  var avatarObject = Parse.Object.extend("Avatars");
  var avatar = new avatarObject();
	
	// Setting the new user credentials
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);

	user.set("privileges", 1); // 1 Is for normal user 2 is for admin
  user.set("isOnline", true); // Setting the user as online
  user.set("gender", gender); // Setting the user gender
  user.set("badges", new Array()); // Setting an empty array of badges for the new user
  user.set("favoriteFood", new Array()); // Setting an empty array of favorite food for the new user

  avatar.set("achievements", new Array()); // Setting an empty array of achievements for the new user avatar

  avatar.save().then(
    function (avatar) {
      user.set("avatar",avatar);
      user.signUp(null, {
        success: function(user) {
          callback(true);
        },
        error: function(user, error) {
          console.log("Signup error: " + error.description);
        }
      });
    }
  );
}

/**
* Logs out the current user
*/
function logout () {
  Parse.User.current().set("isOnline", false, null); // Setting the user as logged off in the DB
  Parse.User.current().save().then(
            function(arg) {
              console.log('User logged off.');
            },
            function(error) {
              console.log('Could not log off, with error: ' + error.description);
            }
  );

  Parse.User.logOut(); // Logging out the current user from the session
}

/**
* Adding the new given achievement to the current user
*/
function addAchievementToUser(achievement, user) {
  var achievementArray = new Array();
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);
  
  query.include("avatar");
  query.get(Parse.User.current().id).then(
              function (parseUser) {
                achievementArray = parseUser.get("avatar").get("achievements"); // Getting the current extras
                achievementArray.push(achievement); // Adding the new achievement
                parseUser.get("avatar").set("achievements", achievementArray);
                parseUser.get("avatar").save(); // Saving the new updated avatar
              },
              function (error) {
                console.log("Could not save achievement, error: " + error.description);
  });
}

/**
* Adding new badge to the given user
*/
function addBagdeToUser (badge, user) {
  var badgesArray = new Array();
  badgesArray = user.getBadges();
  badgesArray.push(badge); // This will add the badge to the local user object

  Parse.User.current().set("badges", badgesArray, null);
  Parse.User.current().save().then(
            function(badge) {
              console.log('Badge was added');
            },
            function(error) {
              console.log('Badge was not added, with error code: ' + error.description);
            }
  );
}

/**
* Adding the user new favorite food
*/
function addFavotireFoodToUser (food, user) {
  var favoriteFoodArray = new Array();
  favoriteFoodArray = user.getFavoriteFood();
  favoriteFoodArray.push(food); // This will add the favorite food to the local user object

  Parse.User.current().set("favoriteFood", favoriteFoodArray, null);
  Parse.User.current().save().then(
            function(food) {
              console.log('Favorite food was added');
            },
            function(error) {
              console.log('Favorite food was not added, with error code: ' + error.description);
            }
  );
}

/**
* Retriving the given user badges, in the callback function an associative array will be received
*/
function getAllUserBadges (callback, user) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.get(Parse.User.current().id).then(
              function (parseUser) {
                var badgesTable = Parse.Object.extend("Badges");
                var query = new Parse.Query(badgesTable);

                query.containedIn("objectId", parseUser.get("badges"));
                query.find().then(
                    function (results) {
                      var badges = new Array();
                      var path = GLOBAL_PREFIX + LOCAL_BADGE_PATH;

                      for (i in results)
                        badges.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                      callback(badges);
                    }
                );
  });
}

/**
* Retriving the given user achievements (extras), in the callback function an associative array will be received
*/
function getAllUserAchievements (callback, user) {
  var avatarTable = Parse.Object.extend("Avatars");
  var query = new Parse.Query(avatarTable);
  var avatarID = user.getAvatar().id;

  query.get(avatarID).then(
        function (parseAvatar) {
          var extraTable = Parse.Object.extend("AvatarExtra");
          var query = new Parse.Query(extraTable);

          query.containedIn("objectId", parseAvatar.get("achievements"));
          query.find().then(
              function (results) {
                var extras = new Array();
                var path = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;

                for (i in results)
                  extras.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                callback(extras);
              }
          );
  });
}

/**
* Retriving the given user favorite food, in the callback function an associative array will be received
*/
function getAllUserFavoriteFood (callback, user) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.get(Parse.User.current().id).then(
        function (parseUser) {
          var foodTable = Parse.Object.extend("Food");
          var query = new Parse.Query(foodTable);

          query.containedIn("objectId", parseUser.get("favoriteFood"));
          query.find().then(
              function (results) {
                var foodArray = new Array();
                var path = GLOBAL_PREFIX + LOCAL_FOOD_PATH;

                for (i in results)
                  foodArray.push({ "id":results[i].id, "path": path + results[i].get("path") }); // Creating the associative array
                callback(foodArray);
              }
          );
  });
}

/**
* Log in function to parse, this will create a parse user over the current session
*/
function logIn (callback, username, password) {
	// Log in to the system
  Parse.User.logIn(username, password, null).then(
  		function(user) {
    	 return user;
  		},
  		function(error) {
    		console.log("LogIn error: " + error.description);
        callback(false);
  		}).then(
          function(user) {
          Parse.User.current().set("isOnline", true, null); // Setting the user as logged in in the DB
          Parse.User.current().save().then(
                    function(arg) {
                      console.log(user.get("username") + " logged in.");
                      callback(true);
      });
  });
}

/**
* Returning toadys lesson (Activity)
*/
function getTodayLesson (callback) {
  var startDate = new Date();
  startDate.setSeconds(0);
  startDate.setMinutes(0);
  startDate.setHours(0);

  var endDate = new Date();
  endDate.setSeconds(59);
  endDate.setMinutes(59);
  endDate.setHours(23);

  var lessonTable = Parse.Object.extend("Lesson");
  var query = new Parse.Query(lessonTable);
  query.greaterThanOrEqualTo("due_date", startDate);
  query.lessThanOrEqualTo("due_date", endDate);
  query.include("badge"); // Including the badge pointer

  query.first().then(
        function(parseLesson) {
          var newLesson = new Lesson();
          if(parseLesson) // If there are any lessons today
          {
            newLesson.setName (parseLesson.get("name"));
            newLesson.setDate (parseLesson.get("due_date"));
            newLesson.setBadge (parseLesson.get("badge").id, GLOBAL_PREFIX + LOCAL_BADGE_PATH + parseLesson.get("badge").get("path"));
            newLesson.setGoogleLink (parseLesson.get("google_link"));
            newLesson.setYoutubeLink (parseLesson.get("youtube_link"));

            callback(newLesson);
          }
          else // Else call the callback with null
            callback(null);
        },
        function(error) {
          console.log("Error: " + error.description);
        }
  );
}

/**
* Returning the current log in user
*/
function getCurrentUser (callback) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.include("avatar"); // Including the avatar pointer

  query.get(Parse.User.current().id).then(
          function(parseUser) {
            callback ( createUserFromParseUser(parseUser) );
          },
          function(error) {
            console.log("Error: " + error.description);
  });
}

/**
* Getting the user avatar, if the function recieve 1 in option then returns the head avatar only
* if option is 2 then returns the path for the full avatar.
* Default is the head avatar
*/
function getUserAvatar (callback, parseAvatar, option) {
    var avatarTable = Parse.Object.extend("Avatars");
    var query = new Parse.Query(avatarTable);
    var avatarID = parseAvatar.id;

    query.include("head_body"); // Including the head pointer
    query.include("hair"); // Including the hair pointer
    query.include("eyes"); // Including the eyes pointer
    query.include("extra"); // Including the body pointer
    query.include("mouth"); // Including the mouth pointer
    
    query.get(avatarID).then(
            function(parseAvatar) {
              callback(createAvatarFromParseObject(parseAvatar, option));
            },
            function(error) {
              console.log("Error: " + error.description);
            }
    );
}

/**
* This function is to set the user avatar, it needs to get the ID's of the elements.
*/
function setUserAvatar (callback, user, head_body, hair, eyes, extra, mouth) {
    var headBodyObject = Parse.Object.extend("AvatarHeadBody");
    var hairObject = Parse.Object.extend("AvatarHair");
    var eyesObject = Parse.Object.extend("AvatarEyes");
    var extraObject = Parse.Object.extend("AvatarExtra");
    var mouthObject = Parse.Object.extend("AvatarMouth");

    var newAvatar = user.getAvatar();

    if (head_body)
      newAvatar.set("head_body", new headBodyObject().set("objectId", head_body));

    if (hair)
      newAvatar.set("hair", new hairObject().set("objectId", hair));

    if (eyes)
      newAvatar.set("eyes", new eyesObject().set("objectId", eyes));

    if (mouth)
      newAvatar.set("mouth", new mouthObject().set("objectId", mouth));

    if (extra) // If there is an extra to set
      newAvatar.set("extra", new extraObject().set("objectId", extra));

    newAvatar.save().then(
      function (newAvatar) {
        callback(true),
      function (error) {
          console.log("Error: " + error.description);
        }
    });
}

/**
* Create new class with the given arguments
*/
function createNewLesson (name, date, badge, youtube, google) {
  var Lesson = Parse.Object.extend("Lesson");
  var lesson = new Lesson();
  var badgeObject = Parse.Object.extend("Badges");

  lesson.set("name", name);
  lesson.set("due_date", date);
  lesson.set("youtube_link", youtube);
  lesson.set("google_link", google);
  lesson.set("badge", new badgeObject().set("objectId", badge));


  lesson.save().then(
    function(lesson) {
       console.log('New lesson created with objectId: ' + lesson.id);
      },
      function(error) {
        console.log('Failed to create new lesson, with error: ' + error.description);
      }
  );
}

/**
* Return to the callback function an array of all items with their id and path
* The possible tables are
* AvatarExtra, AvatarEyes, AvatarHair, AvatarHeadBody, AvatarMouth, Badges, Food
*/
function getAllItems (callback, tableName, option) {
  var table = Parse.Object.extend(tableName);
  var query = new Parse.Query(table);
  var avatarPath = "";

  // Switch case for the tables, Badges table has the full path already
  switch (tableName) {
    case "Badges":
      avatarPath = GLOBAL_PREFIX + LOCAL_BADGE_PATH;
      break;

    case "Food":
      avatarPath = GLOBAL_PREFIX + LOCAL_FOOD_PATH;
      break;

    default:
      if (option == 1)
        avatarPath = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;
      else
        avatarPath = GLOBAL_PREFIX + LOCAL_FULL_AVATAR_PATH;
      break;
  }

  query.find().then(
        function(results) {
          var items = new Array();

          for (var i = 0; i < results.length; i++) {
            var item = results[i];

            items.push({ "id":item.id, "path": avatarPath + item.get("path") });
          }
          callback(items);
        },
        function(error) {
          console.log('Failed to get badges, with error code: ' + error.code);
        }
  );
}

/**
* Calling the callback function with an array of all the online users
*/
function getAllOnlineUsers (callback) {
  var usersTable = Parse.Object.extend("_User");
  var query = new Parse.Query(usersTable);

  query.equalTo("isOnline", true); // Looking for only the online users
  query.include("avatar"); // Including the avatar pointer

  query.find().then(
        function(results) {
          var usersArray = new Array();

          // Going over the results and creating the users array
          for (var i = 0; i < results.length; i++) {
            var user = new User();
            var parseUser = results[i]; // Getting the user from the resuts array
            
            user = createUserFromParseUser(parseUser);

            usersArray.push(user);
          }

          callback(usersArray);
        },
        function(error) {
          console.log('Failed to get users, with error: ' + error.description);
        }
  );
}

/**
* Inner function for creating custom user object from the parse user object
*/
function createUserFromParseUser (parseUser) {
  var user = new User();

  user.setName( parseUser.get("username") );
  user.setEmail( parseUser.get("email") );
  user.setPrivileges( parseUser.get("privileges") );
  user.setGender( parseUser.get("gender") );
  user.setAvatar( parseUser.get("avatar") );
  user.setBadges( parseUser.get("badges") );
  user.setFavoriteFood( parseUser.get("favoriteFood") );

  return user;
}

/**
* Inner function for creating custom avatar object from the parse avatar object
*/
function createAvatarFromParseObject (parseAvatar, option) {
  userAvatar = new Avatar();

  switch (option) {
    case 1:
      var avatarPath = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;
      break;

    case 2:
      var avatarPath = GLOBAL_PREFIX + LOCAL_FULL_AVATAR_PATH;
      break;

    default:
      var avatarPath = GLOBAL_PREFIX + LOCAL_AVATAR_PATH;
      break;
  }

  userAvatar.setHead (avatarPath + parseAvatar.get("head_body").get("path"));
  userAvatar.setEyes (avatarPath + parseAvatar.get("eyes").get("path"));
  userAvatar.setHair (avatarPath + parseAvatar.get("hair").get("path"));
  userAvatar.setMouth (avatarPath + parseAvatar.get("mouth").get("path"));

  if (parseAvatar.get("extra")) // If the user has any extra
    userAvatar.setExtra (avatarPath + parseAvatar.get("extra").get("path"));

  return userAvatar;
}

function getParseObjectById ( callback , tableName , colName , objectId , pointerCol  ){
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


function getLessonContent  (callback , lessonId){
    var resultArray = {};
    var gamesFlag = false;
    var contentFlag = false;
    resultArray['content'] = {};
    resultArray['games'] = {};

    if(!lessonId){
        lessonId = 'wmKCpsrQ5T';
    }

    function getContentCallback(result){


        for ( var i = 0 ; i < result.length ; i++ ){
            resultArray.content[i] = result[i].attributes.content.attributes;
            resultArray.content[i][result[i].attributes.content.attributes.type] = true;
            resultArray.content[i]['objectId'] = result[i].attributes.content.id;
        }
        contentFlag = true;

    };

    function getGamesCallback(result){

        for ( var i = 0 ; i < result.length ; i++ ){
            resultArray.games[i] = result[i].attributes.game.attributes;
            resultArray.games[i]['objectId'] = result[i].attributes.game.id;
        }
        gamesFlag = true;

    };

    if(gamesFlag && contentFlag ){
        callback(resultArray);
    }



    getParseObjectById(getContentCallback , "Content2Lesson" , 'lessonId' , lessonId , 'content');
    getParseObjectById(getGamesCallback , "Games2Lesson" , 'lessonId' , lessonId , 'game');


};







