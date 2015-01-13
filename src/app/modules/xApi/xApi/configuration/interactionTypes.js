(function () {
    'use strict';
    
    angular.module('quiz.xApi').factory('xApiInteractionTypes', xApiInteractionTypes);
    
    function xApiInteractionTypes() {
        var interactionTypes = {
            choice: 'choice',
            fillIn: 'fill-in',
            matching: 'matching',
            other: 'other'
        };
        
        return interactionTypes;
    }
    
}());