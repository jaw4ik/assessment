import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import * as command  from './deleteAnswer.js';

describe('command [deleteAnswer]', () => {
    let questionId = 'questionId',
        answerId = 'answerId';

    it('should post to server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.execute(questionId, answerId);
        expect(http.post).toHaveBeenCalledWith('api/question/rankingText/answer/delete', { questionId : questionId, answerId: answerId });
    });

    describe('when post failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject());
            command.execute().catch(() => {
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
                done();
            });
        });

    });
});