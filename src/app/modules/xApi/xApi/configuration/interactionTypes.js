(function () {
    'use strict';
    
    angular.module('assessment.xApi').factory('xApiInteractionTypes', xApiInteractionTypes);
    
    function xApiInteractionTypes() {
        var interactionTypes = {
            choice: 'choice',
            fillIn: 'fill-in',
            matching: 'matching',
            sequencing: 'sequencing',
            other: 'other'
        };
        
        return interactionTypes;
    }
    
}());