import * as command from './getSettings.js';
import localizationManager from 'localization/localizationManager';
import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';

describe('command [getSettings]', () => {
    let learningPathId = 'learningPathId',
        settings = '{}';

    beforeEach(() => {
        spyOn(localizationManager, 'localize');
    });

    it('should get settings from server', () => {
        spyOn(http, 'get').and.returnValue($.Deferred().resolve({ settings: settings }));
        command.execute(learningPathId);
        expect(http.get).toHaveBeenCalled();
    });

    describe('when request failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'get').and.returnValue($.Deferred().reject('reason'));
            command.execute(learningPathId).catch(reason => {
                expect(reason).toEqual(reason);
                done();
            });
        });

    });
    
    describe('when response does not contain settings', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve());
        });

        it('should reject promise', done => {
            command.execute(learningPathId).catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });
    });

    describe('when response is not json', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve('test'));
        });

        it('should reject promise', done => {
            command.execute(learningPathId).catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });
    });

    describe('when response contains settings', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve({ settings: settings}));
        });

        it('should resolve promise', done => {
            command.execute(learningPathId).then(result => {
                expect(result).toEqual({});
                done();
            });
        });
    });
});