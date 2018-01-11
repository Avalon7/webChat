var app = angular.module('chatApp', ['ngRoute']);
var socket, nickname;
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'login.html',
        controller: 'AuthController'
      }).
      when('/chat', {
        templateUrl: 'chat.html',
        controller: 'ChatController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);
