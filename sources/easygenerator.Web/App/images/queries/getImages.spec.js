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
            spyOn(http, 'get').and.returnValue($.Deferred().reject('reason'));
            query.execute().catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });

    describe('when response is succeed', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve({ success: true, data: [] }));
        });

        it('should resolve promise', done => {
            query.execute().then(images => {
                expect(images).toEqual([]);
                done();
            });
        });

    });

    describe('when response is not succeed', () => {

        beforeEach(() => {
            spyOn(http, 'get').and.returnValue($.Deferred().resolve());
        });

        it('should reject promise', done => {
            query.execute().catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });
});