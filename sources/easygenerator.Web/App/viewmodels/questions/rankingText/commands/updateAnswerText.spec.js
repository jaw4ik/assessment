import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import * as command  from './updateAnswerText.js';

describe('command [updateAnswerText]', () => {
    let text = 'text',
        answerId = 'answerId';

    it('should post to server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.execute(answerId, text);
        expect(http.post).toHaveBeenCalledWith('api/question/rankingText/answer/updateText', { rankingTextAnswerId: answerId, value: text });
    });

    describe('when post failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject('reason'));
            command.execute().catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });

    describe('when post successed', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        });

        it('should resolve promise', done => {
            command.execute().then(() => {
                expect(arguments.length).toEqual(0);
                done();
            });
        });

    });
});