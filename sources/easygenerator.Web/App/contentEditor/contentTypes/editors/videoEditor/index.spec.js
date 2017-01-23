import _ from 'underscore';
import VideoEditorViewModel from './index';
import binder from 'binder';
import TransformVideoUrl from './components/urlTransformer/transform';
import VideoModel from 'videoUpload/models/VideoModel'; 
import VideoFrame from './components/videoFrame/viewmodel';
import uploadManager from 'videoUpload/uploadManager';
import constants from 'constants';

describe('viewmodel [VideoEditor]', () => {
    let learningContentId = '123';
    let defaultNumberForTestsWithNoMeaning = '123';
    let data = '';
    let contentType = constants.contentsTypes.singleVideo;
    let callbacks = {
        startEditing: () => {},
        enableOverlay: () => {},
        disableOverlay: () => {},
        save: () => {},
        endEditing: () => {},
        changeType: () => {}
    };
    let video = new VideoModel({});
    let viewModel = new VideoEditorViewModel(data, callbacks, learningContentId, contentType);
    
    it('should return ctor function', () => {
        expect(VideoEditorViewModel).toBeFunction();
    });

    beforeAll(() => {
        spyOn(uploadManager, 'uploadVideo');
        spyOn(viewModel.video, 'update');
        spyOn(viewModel.callbacks, 'changeType');
        spyOn(viewModel.callbacks, 'save');
        
    });

    describe('ctor', () => {
        beforeEach(() => {
            spyOn(binder, 'bindClass');
        });

        it('should bind class', () => {
            var _viewModel = new VideoEditorViewModel(data, callbacks, learningContentId, contentType);
            expect(binder.bindClass).toHaveBeenCalled();
        });

        it('should initialize fields', () => {
            expect(viewModel.isEditMode).toBeObservable();
            expect(viewModel.isEditMode()).toBeFalsy();
            expect(viewModel.data).toBeObservable();
            expect(viewModel.data()).toEqual(jasmine.any(String));
            expect(viewModel.contentType()).toEqual(jasmine.any(String));
            expect(viewModel.storageSpace).toBeObservable();
            expect(viewModel.linkTooltipShowed).toBeObservable();
            expect(viewModel.isPending).toBeObservable();
            expect(viewModel.isPending()).toBeFalsy();
            expect(viewModel.isSizeChanged).toBeObservable();
            expect(viewModel.videoFrameTextAreaInputValue).toBeObservable();
            expect(viewModel.videoFileSize).toBeObservable();
            expect(viewModel.videoFileSize()).toBe(0);
            expect(viewModel.video instanceof VideoModel).toBeTruthy();
            expect(viewModel.videoFrame instanceof VideoFrame).toBeTruthy();
            expect(viewModel.transformVideoUrl instanceof TransformVideoUrl).toBeTruthy();
            expect(viewModel.callbacks).not.toBe(null);
        });
    });

    describe('upload:', () => {

        it('should call uploadVideo on uploadManager', () => {
            viewModel.upload();
            expect(uploadManager.uploadVideo).toHaveBeenCalled();
        });
    });

    describe('updateVideoInstance:', () => {

        beforeEach(() => {
            spyOn(viewModel, 'finishedUpload');
            spyOn(viewModel, 'failedUpload');
        });

        describe('should set Pending:', () => {

            it('should change Pending when Pending is true', () => {
                viewModel.isPending(true);
                viewModel.updateVideoInstance(video);
                expect(viewModel.isPending()).toBeFalsy();
            });
            it('should not to change Pending when Pending is false', () => {
                viewModel.isPending(false);
                viewModel.updateVideoInstance(video);
                expect(viewModel.isPending()).toBeFalsy();
            });
        });

        it('should call update function on video', () => {
            viewModel.updateVideoInstance(video);
            expect(viewModel.video.update).toHaveBeenCalled();
        });

        it('should call finishedUpload if status is loaded', () => {
            video.status = viewModel.statuses.loaded;
            viewModel.updateVideoInstance(video);
            expect(viewModel.finishedUpload).toHaveBeenCalled();
        });

        it('should call failedUpload if status is failed', () => {
            video.status = viewModel.statuses.failed;
            viewModel.updateVideoInstance(video);
            expect(viewModel.failedUpload).toHaveBeenCalled();
        });
    });

    describe('finishedUpload:', () => {

        beforeEach(() => {
            spyOn(viewModel, 'hideProgressBar');
            spyOn(viewModel, 'clearAssociationBeetwenVideoAndLearningContent');
            spyOn(viewModel, 'store');
            video.vimeoId = Math.random() * (1200 - 1) + 1;
        });
        
        it('should call clearAssociationBeetwenVideoAndLearningContent', () => {
            viewModel.finishedUpload(video);
            expect(viewModel.clearAssociationBeetwenVideoAndLearningContent).toHaveBeenCalled();
        });

        it('should call hideProgressBar', () => {
            viewModel.finishedUpload(video);
            expect(viewModel.hideProgressBar).toHaveBeenCalled();
        });

        it('should call store', () => {
            viewModel.finishedUpload(video);
            expect(viewModel.store).toHaveBeenCalled();

        });

        it('should set videoFileSize to 0', () => {
            viewModel.finishedUpload(video);
            expect(viewModel.videoFileSize()).toEqual(0);
        });

        it('should change videoFrame source', () => {
            let videoFrameSrc = viewModel.videoFrame.src();
            video.vimeoId = defaultNumberForTestsWithNoMeaning;
            viewModel.finishedUpload(video);
            expect(viewModel.videoFrame.src() !== videoFrameSrc).toBeTruthy();
        });
    });

    describe('failedUpload:', () => { 

        beforeEach(() => {
            spyOn(viewModel, 'hideProgressBar');
            spyOn(viewModel, 'clearAssociationBeetwenVideoAndLearningContent');
        });
        
        it('should call clearAssociationBeetwenVideoAndLearningContent', () => {
            viewModel.failedUpload(video);
            expect(viewModel.clearAssociationBeetwenVideoAndLearningContent).toHaveBeenCalled();
        });

        it('should call hideProgressBar', () => {
            viewModel.failedUpload(video);
            expect(viewModel.hideProgressBar).toHaveBeenCalled();
        });
    });

    describe('hideProgressBar:', () => {

        beforeEach(() => {
            viewModel.isPending(true);
        });

        it('should set Pending to false', () => {
            viewModel.hideProgressBar();
            expect(viewModel.isPending()).toBeFalsy();
        });

        it('should set video status to loaded', () => {
            viewModel.hideProgressBar();
            expect(viewModel.video.status()).toBe(viewModel.statuses.loaded);
        });
    });

    describe('clearAssociationBeetwenVideoAndLearningContent:', () => {

        it('should set video associatedLearningContentId to null', () => {
            video.associatedLearningContentId = defaultNumberForTestsWithNoMeaning;
            viewModel.clearAssociationBeetwenVideoAndLearningContent(video);
            expect(video.associatedLearningContentId).toBe(null);
        });
    });

    describe('getFromLibrary:', () => {
        let videoLibrary;
        beforeEach(() => {
            videoLibrary = {
                chooseVideo: () => {
                    return true;
                }
            };
            spyOn(videoLibrary, 'chooseVideo').and.callFake(videoLibrary.chooseVideo());
            viewModel.getFromLibrary();
        });

        it('should call chooseVideo on videoLibrary', () => {
            expect(videoLibrary.chooseVideo).toHaveBeenCalled();
        });
    });

    describe('_isValidLink:', () => {

        it('should return false', () => {
            expect(viewModel._isValidLink('google')).toBeFalsy();
            expect(viewModel._isValidLink('')).toBeFalsy();
            expect(viewModel._isValidLink('www.google')).toBeFalsy();
            expect(viewModel._isValidLink('https://www.google')).toBeFalsy();
            expect(viewModel._isValidLink('google.')).toBeFalsy();
            expect(viewModel._isValidLink('https://google')).toBeFalsy();
            expect(viewModel._isValidLink(`<iframe src=\'https://www.youtube.com/watch?v=uuHWom0rG8Q\'><\iframe>`)).toBeFalsy();
            expect(viewModel._isValidLink('https://www.youtube.com/')).toBeFalsy();
        });

        it('should return true', () => {
            expect(viewModel._isValidLink('https://www.youtube.com/watch?v=uuHWom0rG8Q')).toBeTruthy();
            expect(viewModel._isValidLink('https://youtube.com/watch?v=uuHWom0rG8Q')).toBeTruthy();
            expect(viewModel._isValidLink('https://vimeo.com/28068977')).toBeTruthy();
        });
    });

    describe('getFromLink:', () => {

        beforeEach(() => {
            spyOn(viewModel, 'hideLinkTooltip');
            spyOn(viewModel, 'store');
        });

        it('should change videoFrame source for valid url', () => {
            let videoFrameSrc = viewModel.videoFrame.src();
            let validUrl = 'https://www.localhost.com/watch?v=uuHWom0rG8Q';
            viewModel.videoFrameTextAreaInputValue(validUrl);
            viewModel.getFromLink();
            expect(viewModel.videoFrame.src() !== videoFrameSrc).toBeTruthy();
        });

        it('should not to change videoFrame source for invalid url', () => {
            let videoFrameSrc = viewModel.videoFrame.src();
            let invalidUrl = 'www.localhost';
            viewModel.videoFrameTextAreaInputValue(invalidUrl);
            viewModel.getFromLink();
            expect(viewModel.videoFrame.src() !== videoFrameSrc).toBeFalsy();
        });

        it('should clear input value', () => {
            viewModel.getFromLink();
            expect(viewModel.videoFrameTextAreaInputValue()).toBe('');
        });

        it('should call hideLinkTooltip function', () => {
            viewModel.videoFrameTextAreaInputValue('lorem ipsum');
            viewModel.getFromLink();
            expect(viewModel.hideLinkTooltip).toHaveBeenCalled();
        });

        it('should call store function', () => {
            let validUrl = 'https://www.localhost.com/watch?v=uuHWom0rG8Q';
            viewModel.videoFrameTextAreaInputValue(validUrl);
            viewModel.getFromLink();
            expect(viewModel.store).toHaveBeenCalled();
        });
    });

    describe('_changeType:', () => {

        beforeEach(() => {
            viewModel.contentType(constants.contentsTypes.singleVideo);
        });

        it('should change type for different types', () => {
            viewModel._changeType(constants.contentsTypes.videoWithText);
            expect(viewModel.videoFrameTextAreaInputValue()).toBe('');
        });

        it('should not to change type for same types', () => {
            viewModel._changeType(constants.contentsTypes.singleVideo);
            expect(viewModel.videoFrameTextAreaInputValue()).toBe('');  
        });

        it('should call callbacks save', () => {
            viewModel._changeType(constants.contentsTypes.videoWithText);
            expect(viewModel.callbacks.save).toHaveBeenCalled();  
        });

        it('should call callbacks changeType', () => {
            viewModel._changeType(constants.contentsTypes.singleVideo);            
            expect(viewModel.callbacks.changeType).toHaveBeenCalled();  
        });
    });

    describe('store:', () => {
        let _callbacks;

        beforeEach(() => {
            _callbacks = {
                save: () => { return true; }
            };
            spyOn(_callbacks, 'save').and.callFake(_callbacks.save());
        });

        it('should set html data from videoFrame to data() prop of video editor', () => {
            let videoFrameHtml = viewModel.videoFrame.toHtml();
            viewModel.store();            
            expect(viewModel.data()).toEqual(videoFrameHtml);  
        });

        it('should call callbacks.save', () => {
            viewModel.store();            
            expect(_callbacks.save).toHaveBeenCalled();  
        });
    });

    describe('startEditMode:', () => {

        beforeEach(() => {
            spyOn(callbacks, 'startEditing');
        });

        it('should call callbacks.startEditing', () => {
            viewModel.startEditMode();            
            expect(callbacks.startEditing).toHaveBeenCalled();  
        });

        it('should set isEditMode in true', () => {
            viewModel.startEditMode();            
            expect(viewModel.isEditMode()).toBeTruthy();  
        });

        it('should not to call callbacks.startEditing when isEditMode in true', () => {
            viewModel.isEditMode(true);
            viewModel.startEditMode();            
            expect(callbacks.startEditing).not.toHaveBeenCalled(); 
        });

        it('should not to call callbacks.startEditing when video status is inProgress', () => {
            viewModel.video.status(viewModel.statuses.inProgress);
            viewModel.startEditMode();            
            expect(callbacks.startEditing).not.toHaveBeenCalled(); 
        });

        it('should not to call callbacks.startEditing when isPending in true', () => {
            viewModel.isPending(true);
            viewModel.startEditMode();            
            expect(callbacks.startEditing).not.toHaveBeenCalled(); 
        });
    });

    describe('stopEditMode:', () => {
       
        beforeEach(() => {
            spyOn(callbacks, 'endEditing');
        });

        it('should call callbacks.endEditing', () => {
            viewModel.stopEditMode();            
            expect(callbacks.endEditing).toHaveBeenCalled();  
        });

        it('should set isEditMode in false', () => {
            viewModel.stopEditMode();            
            expect(viewModel.isEditMode()).toBeFalsy();  
        });

        it('should not to call callbacks.stopEditMode when isEditMode in false', () => {
            viewModel.isEditMode(false);
            viewModel.stopEditMode();            
            expect(callbacks.endEditing).not.toHaveBeenCalled(); 
        });
    });

    describe('toLeft:', () => {

        beforeEach(() => {
            spyOn(viewModel, '_changeType');
            viewModel._changeType(constants.contentsTypes.videoInTheLeft);
        });

        it('should call _changeType to specified', () => {
            expect(viewModel._changeType).toHaveBeenCalledWith(constants.contentsTypes.videoInTheLeft); 
        });
    });

    describe('toRight:', () => {

        beforeEach(() => {
            spyOn(viewModel, '_changeType');
            viewModel._changeType(constants.contentsTypes.videoInTheRight);
        });

        it('should call _changeType to specified', () => {
            expect(viewModel._changeType).toHaveBeenCalledWith(constants.contentsTypes.videoInTheRight);
        });
    });

    describe('toCenter:', () => {

        beforeEach(() => {
            spyOn(viewModel, '_changeType');
            viewModel._changeType(constants.contentsTypes.videoWithText);
        });

        it('should call _changeType to specified', () => {
            expect(viewModel._changeType).toHaveBeenCalledWith(constants.contentsTypes.videoWithText);
        });
    });

    describe('showLinkTooltip:', () => {

        beforeEach(() => {
            viewModel.showLinkTooltip();
        });

        it('should set linkTooltipShowed in false', () => {
            expect(viewModel.linkTooltipShowed()).toBeTruthy();  
        });
    });

    describe('hideLinkTooltip:', () => {

        beforeEach(() => {
            viewModel.hideLinkTooltip();
        });

        it('should set linkTooltipShowed in false', () => {
            expect(viewModel.linkTooltipShowed()).toBeFalsy();  
        });
    });

    describe('className:', () => {
        it('should be typeof string', () => {
            expect(viewModel.className).toEqual(jasmine.any(String));
        });
    });
});

    
