define(['repositories/helpHintRepository'],
    function (helpHintRepository) {
        "use strict";

        var constants = require('constants'),
            httpWrapper = require('httpWrapper');

        describe('repository [helpHintRepository]', function () {
            
            it('should be object', function () {
                expect(helpHintRepository).toBeObject();
            });
            
        });
    }
);