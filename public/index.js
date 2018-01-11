var app = angular.module('chatApp', ['ngRoute']);
let socket, nickname;
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/auth/login.html',
        controller: 'LoginController'
      }).
      when('/chat', {
        templateUrl: 'app/chat/chat.html',
        controller: 'ChatController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);
