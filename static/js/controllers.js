/**
* Users Controllers - Handles the Manage Users Part.
* $scope Vars : @param $scope.users - contain all "Users" object from parse .
*               @param $scope.userOrder - init the starting order . (default = username) 
*/
var parseManager = new ParseManager();

var userController = angular.module('userController', []);

userController.controller('TableController', ['$location' ,'$rootScope' , '$scope', '$http', '$routeParams' , function($location , $rootScope , $scope, $http , $routeParams) {

    function logMeIn(user){
        // TODO - HANDLE ERRORS
        console.log("USER LOGGED IN");
        currentUserInstance = new ParseManager.CurrentUser(user);
        console.log("CURRENT USER INSTANCE");
        console.log(currentUserInstance);
        parseManager.setCurrentUser(user);
        $rootScope.currentUser = user;
        $rootScope.$apply();
    };

    function getAllUsers(users){
        // TODO - HANDLE ERRORS
        $scope.users = users;
        $scope.userOrder = 'attributes.username';
        $scope.$apply();
            
    }


    // this function define the active nav bar from the main nav bar by path
    $rootScope.isActive = function (viewLocation) {
      var active = (viewLocation === $location.path());
      return active;
    };

    $scope.sort = function (type){
      console.log('sort type ' + type);
      $scope.userOrder = 'attributes.'+type;
    };

    // PUT THIS IN THE MAIN PAGE GLOBAL SCOPE ?


    parseManager.adminLogIn( logMeIn , "Jorge" , "admin"); 
    parseManager.getParseObject( getAllUsers , "_User" , null);

    // flag that user as a "dirty" which will indicates it was changed..
    $scope.updateUser = function(user){
        user["dirty"] = true;
        console.log($scope.users);
    }; 

    $scope.deleteUser = function (user){
        // TODO
    };

    /*
    $scope.applySave = function(){
      console.log('saving..');
      setTimeout(function() {
       var btn = $('#main_action_button');
      console.log(btn);
       btn.button('complete'); 
       setTimeout(function() {
          btn.button('reset'); 
       },1000);
      
      }, 3000);
      console.log(this.users);
    }; */
}]);




/**
* Games Controllers - Handles the Game Zone Part.
* $scope Vars : @param $scope.games - contain all "Games" object from parse .
*               @param $scope.gamesOrder - init the starting order . (default = gameName) 
*/

var gamesController = angular.module('gamesController', []);

gamesController.controller('GamesController', ['$scope', '$http', '$routeParams' , function($scope, $http , $routeParams) {

     // CallBack function getting object from Parse.
     function getAllGames(games){
        $scope.games = games;
        $scope.gamesOrder = "attributes.gameName"
        $scope.$apply();
        console.log($scope.games);
     }  
     
     // Getting all games from Parse.
     parseManager.getParseObject( getAllGames , "Games" , null);
    
     
     /******
      onClick Event - delete game function .
     ******/
     $scope.deleteGame = function(game){
        /*********
          ParseManager callback function - after delete success from Parse 
          object will be removed from $scope.
        *********/
        
        function deleteResult(result){
          if(result){
            console.log('Delete success');
              var index = $scope.games.indexOf(game);
              $scope.games.splice( index , 1);
              console.log($scope.games);
              $scope.$apply();
              successAlert = new Alert('success' ,'delete game "'+game.attributes.gameName+'" succesfully');
              successAlert.start();
          }else{
            console.log('error');
          }

        };

        parseManager.deleteObject(deleteResult , game);
     };

     /******
      onClick Event - save game function .
     ******/
     $scope.saveGame = function(gameDetails) {        // PROTOTYPE SHOULD BE GENERIC !
                console.log($scope);
                var alertText;
                $('body').css('cursor' , 'progress');  
                if(!gameDetails.id){
                  gameObject = parseManager.createParseObject("Games");
                  for(detail in gameDetails){
                    gameObject.set(detail , gameDetails[detail]);
                  }
                  $scope.games.push(gameObject);
                  alertText = 'New Game Save';

                }else{
                    gameObject = gameDetails;
                    for(detail in gameDetails.attributes){
                        gameObject.set(detail , gameDetails.attributes[detail]); 
                    }
                    alertText = 'Edit Game';
                }
                console.log('SCOPE NEW GAME MODEL');
                console.log($scope.newGameModel);
                delete $scope.newGameModel;
                gameObject.save().then(function (success) {
                  successAlert = new Alert('success' , alertText+' Success');
                  successAlert.start();
                  $('body').css('cursor' , 'default');
                }
                , function (error){
                      failAlert = new Alert('danger' , alertText+' Fail');
                      failAlert.start();
                      console.log("Error: " + error.description);
                      $('body').css('cursor' , 'default');
                });
            };


}]);

/**
* Groups Controllers - Handles the Game Zone Part.
* $scope Vars : @param $scope.games - contain all "Games" object from parse .
*               @param $scope.gamesOrder - init the starting order . (default = gameName) 
*/


var groupController = angular.module('groupController', []);

groupController.controller('GroupController', ['$scope', '$http', '$routeParams' , function($scope, $http , $routeParams) {

       


       function getMyGroups(myGroups){
          console.log("Getting Groups");
          console.log(myGroups);
           $scope.myGroups = myGroups;
           $scope.groupsOrder = "attributes.groupName";
           $scope.$apply();
       };

       parseManager.getParseObject( getMyGroups , "UserGroups" , "ownerId" , Parse.User.current() );

       $scope.deleteGroup  = function (group){
            function deleteGroupCallback(result){
                 var index = $scope.myGroups.indexOf(group);
                 $scope.myGroups.splice( index , 1);
                 $scope.$apply();
                 successAlert = new Alert('success' ,'delete group "'+group.attributes.groupName+'" succesfully');
                 successAlert.start();
            };

            parseManager.deleteObject( deleteGroupCallback , group );

       };

       $scope.saveGroup = function(group) {
        

        function saveGroupCallback(result) {
          // TODO CHECK FOR ERROR
            $scope.myGroups.push(result);
            delete $scope.newGroup;
            $scope.$apply();
        };
       
        group["ownerId"] = Parse.User.current();

        parseManager.saveObject( saveGroupCallback , "UserGroups" , group);
      };

}]);

groupController.controller('GroupDetailsController' , ['$scope', '$http', '$routeParams' , function($scope, $http , $routeParams) { 
     $scope.whichItem = Number($routeParams.groupId);

      function getAllUsersCallback(allUsers){
          $scope.allUsers = allUsers;
          $scope.allUsersOrder = "attributes.userName";
          $scope.$apply();
      }; 

      function getGroupUsersCallback(groupUsers){
          $scope.users = [];
         
          for (index = 0; index < groupUsers.length; ++index) {
           $scope.users.push(groupUsers[index].attributes.user);
          }

          $scope.userOrder = "attributes.username";
          $scope.$apply();
       };

      function getMyGroups(myGroups){
           console.log('getting groups');
           $scope.myGroups = myGroups;
           $scope.currentGroup = $scope.myGroups[$scope.whichItem];
           $scope.$apply();
           parseManager.getParseObjectById( getGroupUsersCallback , "Users2Groups" , "groupId" , $scope.currentGroup.id , "user");
       };

       
      parseManager.getParseObject( getMyGroups , "UserGroups" , "ownerId" , Parse.User.current());
      parseManager.getParseObject( getAllUsersCallback , "_User" , null);


}]);