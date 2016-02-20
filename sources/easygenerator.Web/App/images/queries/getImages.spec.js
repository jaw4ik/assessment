import * as query  from './getImages.js';

import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';

describe('query [getImages]', () => {

    it('should get images from server', () => {
        spyOn(http, 'get').and.returnValue($.Deferred().resolve({ success: true }));
        query.execute();
        expect(http.get).toHaveBeenCalledWith('api/images');
    });

    describe('when request failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'get').and.returnValue($.Deferred().reject());
            query.execute().catch(() => {
                done();
            });
        });

    });

    describe('when response is succeed', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve({ success: true }));
        });

        it('should resolve promise', done => {
            query.execute().then(() => {
                done();
            });
        });

    });

    describe('when response is not succeed', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve());
        });

        it('should reject promise', done => {
            query.execute().catch(() => {
                done();
            });
        });

    });
});