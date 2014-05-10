var myApp = angular.module('myApp', [
  'ngRoute',
  'userController',
  'gamesController',
  'contentController',
  'lessonsController',
  'groupController',
  'mainController'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/Users_Manage', {
    templateUrl: 'partials/table_users.html',
    controller: 'TableController'
  }).
  when('/Games_Manage', {
    templateUrl: 'partials/table_games.html',
    controller: 'GamesController'
  }).
  when('/Content_Manage', {
    templateUrl: 'partials/table_content.html',
    controller: 'ContentListController'
  }).
  when('/Groups_Manage' , {
      templateUrl: 'partials/groups_table.html',
      controller: 'GroupController'
  }).
  when('/Groups_Manage/:groupId' , {
      templateUrl: 'partials/group_details.html',
      controller: 'GroupDetailsController'
  }).
  when('/Lessons_Manage' , {
       templateUrl: 'partials/table_lessons.html',
       controller: 'LessonsListController'
   }).
   when('/Games_Manage/Trivia' , {
        templateUrl: 'partials/trivia_list.html',
        controller: 'TriviaListController'
   }).
  otherwise({
    redirectTo: '/Users_Manage'
  });

}]);