var myApp = angular.module('myApp', [
  'ngRoute',
  'userController',
  'gamesController',
  'groupController'
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
  when('/Content_Manage/:contentId', {
    templateUrl: 'partials/content_table.html',
    controller: 'TableController'
  }).
  when('/Groups_Manage' , {
      templateUrl: 'partials/groups_table.html',
      controller: 'GroupController'
  }).
  when('/Groups_Manage/:groupId' , {
      templateUrl: 'partials/group_details.html',
      controller: 'GroupDetailsController'
  }).
  otherwise({
    redirectTo: '/Users_Manage'
  });
}]);