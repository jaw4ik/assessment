import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import * as query  from './getAnswers.js';

describe('query [getAnswers]', () => {
    let questionId = 'questionId';

    it('should get answers from server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve({ success: true }));
        query.execute(questionId);
        expect(http.post).toHaveBeenCalledWith('api/question/rankingText/answers', { questionId: questionId });
    });

    describe('when request failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'post').and.returnValue($.Deferred().reject());
            query.execute(questionId).catch(() => {
                done();
            });
        });

    });

    describe('when response is succeed', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve({ success: true }));
        });

        it('should resolve promise', done => {
            query.execute(questionId).then(() => {
                done();
            });
        });

    });

    describe('when response is not succeed', () => {

        beforeEach(() => {
            spyOn(http, 'post').and.returnValue($.Deferred().resolve());
        });

        it('should reject promise', done => {
            query.execute(questionId).catch(() => {
                done();
            });
        });

    });
});