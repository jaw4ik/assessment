import ko from 'knockout';
import repository from 'repositories/videoRepository';
import thumbnailLoader from 'videoUpload/handlers/thumbnails';
import { map } from 'videoUpload/mappers/videoMapper';
import videoCommands from './index';

describe('[getCollectionVideo]', () => {
    let getVideoCollectionDeferred = Q.defer(),
        thumbnailLoaderGetThumbnailUrlsDeferred = Q.defer(),
        video1 = {
            id: 1,
            title: 'title',
            vimeoId: 'vieoId',
            createdOn: new Date,
            modifiedOn: new Date,
            thumbnailUrl: '123',
            progress: 100,
            status: 'loaded'
        },
        video2 = {
            id: 2,
            title: 'title',
            vimeoId: ko.observable(null),
            createdOn: ko.observable(null),
            modifiedOn: ko.observable(null),
            thumbnailUrl: ko.observable(null),
            progress: ko.observable(50),
            status: ko.observable('inProgress')
        },
        videos = new Array(video1, video2);

    beforeEach(() => {
        spyOn(thumbnailLoader, 'getThumbnailUrls').and.returnValue(thumbnailLoaderGetThumbnailUrlsDeferred.promise);
        spyOn(repository, 'getCollection').and.returnValue(getVideoCollectionDeferred.promise);
        getVideoCollectionDeferred.resolve(videos);
        thumbnailLoaderGetThumbnailUrlsDeferred.resolve();
    });  
    
    it('should be function', () => {
        expect(videoCommands.getCollection).toBeFunction();
    });

    it('should be function', () => {
        expect(videoCommands.getCollection).toBeFunction();
    });

    it('should get video collection', (done) => {
        var promise = videoCommands.getCollection();

        promise.then(() => {
            expect(repository.getCollection).toHaveBeenCalled();
            done();
        });
    });

    it('should get getThumbnailUrls', (done) => {
        var promise = videoCommands.getCollection();

        promise.then(() => {
            expect(thumbnailLoader.getThumbnailUrls).toHaveBeenCalled();
            done();
        });
    });

    it('should map all videos', (done) => {
        var promise = videoCommands.getCollection();

        promise.then((_videos) => {
            expect(_videos.length).toBe(2);
            expect(_videos[0].id).toBe(video1.id);
            expect(_videos[0].vimeoId()).toBe(video1.vimeoId);
            expect(_videos[0].createdOn()).toBe(video1.createdOn);
            expect(_videos[0].modifiedOn()).toBe(video1.modifiedOn);
            expect(_videos[0].thumbnailUrl()).toBe(video1.thumbnailUrl);
            expect(_videos[0].progress()).toBe(video1.progress);
            expect(_videos[0].status()).toBe(video1.status);
            expect(_videos[0].isDeleteConfirmationShown()).toBeFalsy();
            expect(_videos[0].isDeleting()).toBeFalsy();
            done();
        });

    });
});