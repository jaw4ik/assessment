import command from './deleteVideo';

import httpWrapper from 'http/storageHttpWrapper';
import dataContext from 'dataContext';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';

describe('command video [deleteVideo]', function () {

    describe('execute:', function () {

        var defer = Q.defer(),
            identifyDefer = Q.defer(),
            video = {
                id: 'videoId'
            };

        beforeEach(function () {
            spyOn(app, 'trigger');
            spyOn(httpWrapper, 'post').and.returnValue(defer.promise);
            spyOn(userContext, 'identifyStoragePermissions').and.returnValue(identifyDefer.promise);
        });

        it('should return promise', function () {
            expect(command.execute()).toBePromise();
        });

        it('should delete video', function (done) {
            defer.resolve();
            command.execute(video.id).fin(function () {
                expect(httpWrapper.post).toHaveBeenCalledWith(constants.storage.host + constants.storage.video.deleteUrl, { videoId: video.id });
                done();
            });
        });

        describe('when video deleted successfully', function () {
            beforeEach(function () {
                dataContext.videos = [video];
                defer.resolve();
            });

            it('should remove video from data context', function (done) {
                command.execute(video.id).fin(function () {
                    expect(dataContext.videos.length).toBe(0);
                    done();
                });
            });

            it('should identiry user storage permissions', function (done) {
                command.execute(video.id).fin(function () {
                    expect(userContext.identifyStoragePermissions).toHaveBeenCalled();
                    done();
                });
            });

            describe('and when user storage permissions identified', function () {
                beforeEach(function () {
                    identifyDefer.resolve();
                });

                it('should trigger changes in quota event', function (done) {
                    command.execute(video.id).fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.storage.changesInQuota);
                        done();
                    });
                });
            });
        });

    });
});
