﻿define(['models/video'],
    function (VideoModel) {
        "use strict";

        var
            map = function (item) {
                return new VideoModel({

                    id: item.Id,
                    title: item.Title,
                    vimeoId: item.VimeoId,
                    thumbnailUrl: item.ThumbnailUrl,
                    videoIframe: item.VideoIframe,
                    size: item.Size

                });
            };

        return {
            map: map
        };
    });