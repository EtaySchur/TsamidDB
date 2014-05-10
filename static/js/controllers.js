/**
* Users Controllers - Handles the Manage Users Part.
* $scope Vars : @param $scope.users - contain all "Users" object from parse .
*               @param $scope.userOrder - init the starting order . (default = username) 
*/
var parseManager = new ParseManager();

var mainController = angular.module('mainController', []);

mainController.controller('MainController', ['$location' ,'$rootScope' , '$scope', '$http', '$routeParams' , function($location , $rootScope , $scope, $http , $routeParams) {

    $rootScope.initVars = function(){
        $rootScope.selectedItems = [];
        $rootScope.disableDeleteButtonDisplay = true;
    };

    function logMeIn(user){
        // TODO - HANDLE ERRORS
        console.log("USER LOGGED IN");
        currentUserInstance = new ParseManager.CurrentUser(user);
        console.log("CURRENT USER INSTANCE");
        console.log(currentUserInstance);
        parseManager.setCurrentUser(user);
        parseManager.getLessonContent(null);
        $rootScope.currentUser = user;
        $rootScope.$apply();
    };

    // this function define the active nav bar from the main nav bar by path
    $rootScope.isActive = function (viewLocation) {
       // alert($location.path().indexOf(viewLocation) > -1)
        var active = ($location.path().indexOf(viewLocation) > -1);

        return active;
    };

    // GLOBAL VARS

    $rootScope.selectedItems = []; // Array to store selected items from multiple actions
    $rootScope.disableDeleteButtonDisplay = true;

    $rootScope.toggleCheck = function (item) {
        if ($rootScope.selectedItems.indexOf(item) === -1) {
            $rootScope.selectedItems.push(item);
            $rootScope.disableDeleteButtonDisplay = false;
        } else {
            $rootScope.selectedItems.splice($rootScope.selectedItems.indexOf(item), 1);
            if($rootScope.selectedItems.length == 0 ){
                $rootScope.disableDeleteButtonDisplay = true;
            }
        }
    };



    parseManager.adminLogIn( logMeIn , "Jorge" , "admin");

}]);


var userController = angular.module('userController', []);

userController.controller('TableController', ['$location' ,'$rootScope' , '$scope', '$http', '$routeParams' , function($location , $rootScope , $scope, $http , $routeParams) {



    function getAllUsers(users){
        // TODO - HANDLE ERRORS
        $scope.users = users;
        $scope.userOrder = 'attributes.username';
        $scope.$apply();
    }

    $scope.sort = function (type){
      console.log('sort type ' + type);
      $scope.userOrder = 'attributes.'+type;
    };

    // PUT THIS IN THE MAIN PAGE GLOBAL SCOPE ?



    parseManager.getParseObject( getAllUsers , "_User" , null);

    // flag that user as a "dirty" which will indicates it was changed..
    $scope.updateUser = function(user){
        user["dirty"] = true;
        console.log($scope.users);
    }; 

    $scope.deleteUser = function (user){
        // TODO
    };
}]);




/**
* Games Controllers - Handles the Game Zone Part.
* $scope Vars : @param $scope.games - contain all "Games" object from parse .
*               @param $scope.gamesOrder - init the starting order . (default = gameName) 
*/

var gamesController = angular.module('gamesController', []);

gamesController.controller('GamesController', ['$rootScope' , '$scope', '$http', '$routeParams' , function($rootScope , $scope, $http , $routeParams) {



    //$scope.deleteSelectedButtonStyle = { opacity : '0.5'};

    $scope.sort = function (type){
      $scope.gamesOrder = type;
    };

     // CallBack function getting object from Parse.
     function getAllGames(games){
        $scope.games = games;
        $scope.gamesOrder = "gameName"
        $scope.$apply();
        console.log($scope.games);
     }  
     
     // Getting all games from Parse.
     parseManager.getParseObject( getAllGames , "Games" , null);


    function multipleDeleteCallback(result){

        var successAlert = new Alert('success' ,'delete items successfully');
        successAlert.start();
        for ( var i = 0 ; i < $rootScope.selectedItems.length ; i++){
            var index = $scope.games.indexOf($rootScope.selectedItems[i]);
            $scope.games.splice( index , 1);
        }
        $scope.$apply();
        $rootScope.selectedItems = [];
    };

    $scope.deleteSelectedItems = function(){
        if($rootScope.selectedItems.length > 0 ){
            parseManager.deleteMultipleItems( multipleDeleteCallback , $rootScope.selectedItems);
        }
    };
     
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
                console.log(gameDetails);
                console.log($scope);
                var alertText;
                $('body').css('cursor' , 'progress');  
                if(!gameDetails.id){
                  gameObject = parseManager.createParseObject("TriviaGames");
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

gamesController.controller('TriviaListController', ['$rootScope' , '$scope', '$http', '$routeParams' , function($rootScope , $scope, $http , $routeParams) {

       $scope.answerModel = [];


       $scope.saveNewQuestion = function (questionModel , answerModel1 , answerModel2){
           console.log(answerModel1);
           console.log(answerModel2);

           function saveNewQuestionCallback(result){

           };

           function saveNewAnswerCallback(result){

           };

           parseManager.saveObject(saveNewQuestionCallback , "TriviaQuestions" , questionModel);
           parseManager.saveObject(saveNewAnswerCallback , "TriviaAnswers" , answerModel1);
           parseManager.saveObject(saveNewAnswerCallback , "TriviaAnswers" , answerModel2);
       };

}]);


/**
* Groups Controllers - Handles the Game Zone Part.
* $scope Vars : @param $scope.games - contain all "Games" object from parse .
*               @param $scope.gamesOrder - init the starting order . (default = gameName) 
*/


var groupController = angular.module('groupController', []);

groupController.controller('GroupController', ['$scope', '$http', '$routeParams' , function($scope, $http , $routeParams) {

       $scope.myGroups = [];

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
                 var successAlert = new Alert('success' ,'delete group "'+group.attributes.groupName+'" succesfully');
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

var contentController = angular.module('contentController', []);

contentController.controller('ContentListController' , ['$scope', '$http', '$routeParams' , function($scope, $http , $routeParams) {
    $scope.content = [];

    $scope.isSelected = function (item , type){
        if(item.attributes.type == type){
            return 'select';
        }else{
            return "";
        }
    };

    $scope.sort = function (type){
        $scope.contentOrder = 'attributes.'+type;
    };


    function getAllContentCallback(content){
       $scope.content = content;
       $scope.contentOrder = 'attributes.title';
       $scope.$apply();
    };

    parseManager.getParseObject( getAllContentCallback , "Content" , null );

    $scope.saveContent = function(item){

        function saveContentCallback(result){
                if(!item.id){
                    $scope.content.push(result);
                    delete $scope.newContentModel;
                    $scope.$apply();
                }

        };

        parseManager.saveObject( saveContentCallback , "Content" , item );

    };

}]);

var lessonsController = angular.module('lessonsController', []);

lessonsController.controller('LessonsListController' , ['$scope', '$http', '$routeParams' , function($scope, $http , $routeParams) {
    $scope.lessons = [];

    function getAllLessonsCallback(lessons){
        console.log(lessons);
        $scope.lessons = lessons;
        $scope.lessonsOrder = 'attributes.name';
        $scope.$apply();
    };

    parseManager.getParseObject( getAllLessonsCallback , "Lesson" , null );



}]);

