import * as command  from './saveSettings.js';

import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';

describe('command [saveSettings]', () => {
    let learningPathId = 'learningPathId',
        settings = {};


    it('should post to server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.execute(learningPathId, settings);
        expect(http.post).toHaveBeenCalledWith('/api/learningpath/learningPathId', { settings : '{}' });
    });

    describe('when post failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject('reason'));
            command.execute(learningPathId, settings).catch(reason => {
                expect(reason).toEqual('reason');
                done();
            });
        });
    });

    describe('when post successed', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        });

        it('should resolve promise', done => {
            command.execute(learningPathId, settings).then(result => {
                expect(result).toEqual(true);
                done();
            });
        });
    });
});