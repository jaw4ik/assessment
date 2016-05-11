import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import * as command  from './addAnswer.js';

describe('command [addAnswer]', () => {
    let questionId = 'questionId';

    it('should post to server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.execute(questionId);
        expect(http.post).toHaveBeenCalledWith('api/question/rankingText/answer/add', { questionId : questionId });
    });

    describe('when post failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject('reason'));
            command.execute(questionId).catch(reason => {
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
            command.execute(questionId).then(() => {
                expect(arguments.length).toEqual(0);
                done();
            });
        });

    });
});