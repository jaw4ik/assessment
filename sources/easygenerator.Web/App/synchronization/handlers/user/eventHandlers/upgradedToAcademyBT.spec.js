import handler from './upgradedToAcademyBT';

import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization user [upgradedToAcademyBT]', function () {

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when user identity is not an object', function () {

        it('should throw an exception', function () {
            userContext.identity = undefined;

            var f = function () {
                handler('2014-03-19T12:49:34.7396182Z');
            };

            expect(f).toThrow();
        });

    });

    it('should upgrade user to starter plan', function () {
        userContext.identity = jasmine.createSpyObj('identity', ['upgradeToAcademyBT']);
        handler('2014-03-19T12:49:34.7396182Z');
        expect(userContext.identity.upgradeToAcademyBT).toHaveBeenCalled();
    });


    it('should trigger \'user:upgradeToAcademyBT\' event', function () {
        userContext.identity = jasmine.createSpyObj('identity', ['upgradeToAcademyBT']);
        handler();
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.upgradedToAcademyBT);
    });

    it('should trigger \'user:planChanged\' event', function () {
        userContext.identity = jasmine.createSpyObj('identity', ['upgradeToAcademyBT']);
        handler();
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.planChanged);
    });

});
