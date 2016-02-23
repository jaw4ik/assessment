import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import * as command  from './updateAnswersOrder.js';

describe('command [updateAnswersOrder]', () => {
    let questionId = 'questionId',
        answers = [{id: 'id1'}, {id: 'id2'}];

    it('should post to server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.execute(questionId, answers);
        expect(http.post).toHaveBeenCalledWith('api/question/rankingText/answers/updateOrder', { questionId: questionId, answers: ['id1', 'id2'] });
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