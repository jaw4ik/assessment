﻿define(['models/video', 'constants'],
    function (VideoModel, constants) {
        "use strict";

        describe('videoModel', function () {

            describe('when video all parameters are defined', function () {

                it('should set all parameters to defined values', function () {
                    var id = '123',
                        createdOn = new Date(),
                        modifiedOn = new Date(),
                        title = '123',
                        vimeoId = '123',
                        thumbnailUrl = '123',
                        progress = '123',
                        status = constants.storage.video.statuses.failed;

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

                    expect(video.id).toEqual(id);
                    expect(video.createdOn).toEqual(createdOn);
                    expect(video.modifiedOn).toEqual(modifiedOn);
                    expect(video.title).toEqual(title);
                    expect(video.vimeoId).toEqual(vimeoId);
                    expect(video.thumbnailUrl).toEqual(thumbnailUrl);
                    expect(video.progress).toEqual(progress);
                    expect(video.status).toEqual(status);

                });

            });

            describe('when video all parameters are defined except status', function () {

                it('should set all parameters to defined values and status to default', function () {
                    var id = '123',
                        createdOn = new Date(),
                        modifiedOn = new Date(),
                        title = '123',
                        vimeoId = '123',
                        thumbnailUrl = '123',
                        progress = '123';

                    var video = new Video({
                        id: id,
                        createdOn: createdOn,
                        modifiedOn: modifiedOn,
                        title: title,
                        vimeoId: vimeoId,
                        thumbnailUrl: thumbnailUrl,
                        progress: progress
                    });

                    expect(video.id).toEqual(id);
                    expect(video.createdOn).toEqual(createdOn);
                    expect(video.modifiedOn).toEqual(modifiedOn);
                    expect(video.title).toEqual(title);
                    expect(video.vimeoId).toEqual(vimeoId);
                    expect(video.thumbnailUrl).toEqual(thumbnailUrl);
                    expect(video.progress).toEqual(progress);
                    expect(video.status).toEqual(constants.storage.video.statuses.loaded);

                });

            });

        });

    });