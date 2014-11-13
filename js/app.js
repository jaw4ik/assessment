'use strict';
var app = angular.module('quiz', []);

app.controller('QuizController', ['$http', function ($http) {
    var that = this;

    that.title = '';

    $http.get('/content/data.js').success(function (response) {
        that.title = response.title;



    });
}]);




