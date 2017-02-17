import * as query  from './getImages.js';
import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import constants from 'constants';

describe('query [getImages]', () => {

    let getImagesUrl;

    beforeEach(() => {
        getImagesUrl = `${constants.imageService.host}/images`;
    });

    it('should get images from the server', () => {
        spyOn(http, 'get').and.returnValue(Promise.resolve());
        query.execute();
        expect(http.get).toHaveBeenCalledWith(getImagesUrl);
    });

    describe('when images loaded successfully', () => {

        let httpPromise;
        let response;

        beforeEach(() => {
            response = 'some response';
            httpPromise = Promise.resolve(response);
            spyOn(http, 'get').and.returnValue(httpPromise);
        });

        it('should return images', done => (async () => {
            await httpPromise;
            var result = await query.execute();
            expect(result).toBe(response);
        })().then(done));

    });

    describe('when images loaded failure', () => {

        let httpPromise;
        let reason;

        beforeEach(() => {
            reason = 'some reason';
            httpPromise = Promise.reject(reason);
            spyOn(http, 'get').and.returnValue(httpPromise);
        });

        it('should return images', done => (async () => {
            try {
                query.execute();
                await httpPromise;
            } catch (e) {
                expect(e).toBe(reason);
            } 
        })().then(done));

    });

});