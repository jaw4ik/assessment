define(['repositories/videoRepository'], function (repository) {
    "use strict";

    var
       dataContext = require('dataContext'),
       Video = require('models/video')
    ;

    describe('repository [videoRepository]', function () {

        it('should be object', function () {
            expect(repository).toBeObject();
        });

        describe('getCollection:', function () {

            it('should be function', function () {
                expect(repository.getCollection).toBeFunction();
            });

            it('should be resolved with videos collection', function (done) {
                var id = '123',
                    id2 = '124',
                    createdOn = new Date(),
                    modifiedOn = new Date(),
                    title = '123',
                    vimeoId = '123',
                    thumbnailUrl = '123',
                    progress = '123',
                    status = 'loaded';

                var videoList = [new Video({
                    id: id,
                    createdOn: createdOn,
                    modifiedOn: modifiedOn,
                    title: title,
                    vimeoId: vimeoId,
                    thumbnailUrl: thumbnailUrl,
                    progress: progress,
                    status: status
                }), new Video({
                    id: id2,
                    createdOn: createdOn,
                    modifiedOn: modifiedOn,
                    title: title,
                    vimeoId: vimeoId,
                    thumbnailUrl: thumbnailUrl,
                    progress: progress,
                    status: status
                })];

                dataContext.videos = videoList;

                var promise = repository.getCollection();

                promise.fin(function () {
                    expect(promise).toBeResolvedWith(videoList);
                    done();
                });
            });

        });

        describe('getById:', function () {

            it('should be function', function () {
                expect(repository.getById).toBeFunction();
            });

            it('should return promise', function () {
                var result = repository.getById('0');
                expect(result).toBePromise();
            });

            describe('when arguments not valid', function () {

                describe('and when Id is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () { repository.getById(); };
                        expect(f).toThrow('Video id (string) was expected');
                    });

                });

                describe('and when Id is null', function () {

                    it('should throw exception', function () {
                        var f = function () { repository.getById(null); };
                        expect(f).toThrow('Video id (string) was expected');

                    });
                });

            });

            describe('when arguments are valid', function () {

                it('should return promise', function () {
                    var result = repository.getById('0');
                    expect(result).toBePromise();
                });

                describe('and when video does not exist', function () {

                    it('should be rejected', function (done) {
                        dataContext.videos = [];
                        var promise = repository.getById('-1');

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Video does not exist');
                            done();
                        });
                    });

                });

                describe('and when video exists', function () {

                    it('should be resolved with video from dataContext', function (done) {
                        var id = '123',
                            createdOn = new Date(),
                            modifiedOn = new Date(),
                            title = '123',
                            vimeoId = '123',
                            thumbnailUrl = '123',
                            progress = '123',
                            status = 'loaded';

                        var video = new Video({
                            id: id,
                            createdOn: createdOn,
                            modifiedOn: modifiedOn,
                            title: title,
                            vimeoId: vimeoId,
                            thumbnailUrl: thumbnailUrl,
                            progress: progress,
                            status: status
                        });

                        dataContext.videos = [video];

                        var promise = repository.getById(id);

                        promise.fin(function () {
                            expect(promise).toBeResolvedWith(video);
                            done();
                        });
                    });

                });

            });

        });

        describe('addVideo:', function () {
            it('should be function', function () {
                expect(repository.addVideo).toBeFunction();
            });

            describe('when video is not an object', function () {
                it('should throw exception', function () {
                    var f = function () { repository.addVideo(null); };
                    expect(f).toThrow('Video is not an object');
                });
            });

            describe('when video id is not a string', function () {
                it('should throw exception', function () {
                    var f = function () { repository.addVideo({ id: null }); };
                    expect(f).toThrow('Video id is not a string');
                });
            });

            it('should add video to the top of array in dataContext', function () {
                var id = '123',
                    id2 = '124',
                    createdOn = new Date(),
                    modifiedOn = new Date(),
                    title = '123',
                    vimeoId = '123',
                    thumbnailUrl = '123',
                    progress = '123',
                    status = 'loaded';

                var videoList = [new Video({
                    id: id,
                    createdOn: createdOn,
                    modifiedOn: modifiedOn,
                    title: title,
                    vimeoId: vimeoId,
                    thumbnailUrl: thumbnailUrl,
                    progress: progress,
                    status: status
                })];

                var video = new Video({
                    id: id2,
                    createdOn: createdOn,
                    modifiedOn: modifiedOn,
                    title: title,
                    vimeoId: vimeoId,
                    thumbnailUrl: thumbnailUrl,
                    progress: progress,
                    status: status
                });

                dataContext.videos = videoList;
                repository.addVideo(video);

                expect(dataContext.videos.length).toBe(2);
                expect(dataContext.videos[0]).toBe(video);
            });
        });

        describe('removeVideo:', function () {
            it('should be function', function () {
                expect(repository.removeVideo).toBeFunction();
            });

            describe('when video does not exist in dataContext', function () {
                it('should return false', function () {
                    dataContext.videos = [];
                    var result = repository.removeVideo('123');
                    expect(result).toBeFalsy();
                });
            });

            describe('when video exists in dataContext', function () {
                it('should return remove video from dataContext', function () {
                    var id = '123',
                     id2 = '124',
                     createdOn = new Date(),
                     modifiedOn = new Date(),
                     title = '123',
                     vimeoId = '123',
                     thumbnailUrl = '123',
                     progress = '123',
                     status = 'loaded';

                    var video = new Video({
                        id: id2,
                        createdOn: createdOn,
                        modifiedOn: modifiedOn,
                        title: title,
                        vimeoId: vimeoId,
                        thumbnailUrl: thumbnailUrl,
                        progress: progress,
                        status: status
                    });

                    var videoList = [new Video({
                        id: id,
                        createdOn: createdOn,
                        modifiedOn: modifiedOn,
                        title: title,
                        vimeoId: vimeoId,
                        thumbnailUrl: thumbnailUrl,
                        progress: progress,
                        status: status
                    }), video];

                    dataContext.videos = videoList;

                    var result = repository.removeVideo(id);

                    expect(result).toBeTruthy();
                    expect(dataContext.videos.length).toBe(1);
                    expect(dataContext.videos[0]).toBe(video);
                });

            });

        });

    });

});