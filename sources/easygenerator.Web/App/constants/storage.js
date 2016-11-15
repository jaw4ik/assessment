export default {
    host: window.storageServiceUrl ? `//${window.storageServiceUrl}` : '//localhost:888',
    mediaUrl: '/media',
    userUrl: '/user',
    changesInQuota: 'storage:changesInQuota',
    video: {
        vimeoUrl: 'https://vimeo.com',
        vimeoOembedUrl: '/api/oembed.json',
        vimeoApiVideosUrl: 'https://api.vimeo.com/videos/',
        ticketUrl: '/api/media/video/upload',
        finishUrl: '/api/media/video/upload/finish',
        progressUrl: '/api/media/video/upload/progress',
        defaultThumbnailUrl: '//i.vimeocdn.com/video/default_200x113.jpg',
        cancelUrl: '/api/media/video/upload/cancel',
        deleteUrl: '/api/media/video/delete',
        statuses: {
            loaded: 'loaded',
            failed: 'failed',
            inProgress: 'inProgress'
        },
        vimeoVerifyStatus: 308,
        changesInUpload: 'video:changesInUpload',
        trackChangesInUploadTimeout: 500,
        iframeWidth: 600,
        iframeHeight: 335,
        updateUploadTimeout: 60000,
        removeVideoAfterErrorTimeout: 5000
    },
    audio: {
        convertionUrl: window.convertionServiceUrl ? `//${window.convertionServiceUrl}` : '//staging.easygenerator.com/convertion',
        pullUrl: '/api/media/audio/pull',
        ticketUrl: '/api/media/audio/ticket',
        deleteUrl: '/api/media/audio/delete',
        trackerTimeout: 25000,
        statuses: {
            available: 'available',
            notAvailable: 'notAvailable',
            notStarted: 'notStarted',
            loaded: 'loaded',
            failed: 'failed',
            inProgress: 'inProgress'
        },
        changesInUpload: 'video:changesInUpload',
        iframeWidth: 600,
        iframeHeight: 180,
        embedIframeWidth: 300,
        embedIframeHeight: 46
    }
};