import * as command  from './deleteImage.js';
import http from 'http/apiHttpWrapper.js';
import constants from 'constants';

var deleteUrl = `${constants.imageService.host}/image`;

describe('command [deleteImage]', () => {

    it('should send delete request to server', () => {
        spyOn(http, 'remove').and.returnValue($.Deferred().resolve(true));
        command.execute('imageFileId');
        expect(http.remove).toHaveBeenCalledWith(deleteUrl, { id : 'imageFileId' });
    });

    describe('when deleting failed', () => {

        it('should reject promise', done => {
            spyOn(http, 'remove').and.returnValue($.Deferred().reject('reason'));
            command.execute().catch(reason => {
                expect(reason).toBeDefined();
                done();
            });
        });

    });

    describe('when deleting successed', () => {

        beforeEach(() => {
            spyOn(http, 'remove').and.returnValue($.Deferred().resolve(true));
        });

        it('should resolve promise', done => {
            command.execute().then(() => {
                expect(arguments.length).toEqual(0);
                done();
            });
        });

    });
});