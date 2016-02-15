import $ from 'jquery';
import http from 'http/apiHttpWrapper.js';
import * as command  from './deleteImage.js';

describe('command [deleteImage]', () => {

    it('should post to server', () => {
        spyOn(http, 'post').and.returnValue($.Deferred().resolve(true));
        command.execute('imageFileId');
        expect(http.post).toHaveBeenCalledWith('storage/image/delete', { imageFileId : 'imageFileId' });
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