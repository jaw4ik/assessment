import HotspotOnAnImage from './hotspotOnAnImage';

import hotspotParser from './components/hotspotParser';
import ko from 'knockout';
import app from 'durandal/app';
import constants from 'constants';
import uiLocker from 'uiLocker';
import imageUpload from 'imageUpload';
import eventTracker from 'eventTracker';

describe('viewmodel HotspotOnAnImage', function () {

    var _questionId = 'questionId',
        _questionType = 'questionType',
        canBeAddedImmediately = false,
        imageUploadFake;


    beforeEach(function () {
        imageUploadFake = function(spec){};
        spyOn(imageUpload, 'upload').and.callFake(function(spec) { imageUploadFake(spec); });
    });

    describe('when learningContent is defined in database', function () {
        var learningContent = {
            id: 'hotspotId',
            text: 'text',
            type: constants.learningContentsTypes.hotspot
        },
            learningContentInstance = null;

        beforeEach(function () {
            learningContentInstance = new HotspotOnAnImage(learningContent, _questionId, _questionType, canBeAddedImmediately);
            spyOn(app, 'trigger');
            spyOn(eventTracker, 'publish');
            spyOn(learningContentInstance, 'updateLearningContent').and.callFake(function () { });
            spyOn(learningContentInstance, 'removeLearningContent').and.callFake(function () { });
            spyOn(learningContentInstance, 'restoreLearningContent').and.callFake(function () { });
        });

        it('should initialize field', function () {
            expect(learningContentInstance.id()).toBe(learningContent.id);
            expect(learningContentInstance.text()).toBe(learningContent.text);
            expect(learningContentInstance.originalText).toBe(learningContent.text);
            expect(learningContentInstance.type).toBe(learningContent.type);
            expect(learningContentInstance.polygons).toBeObservableArray();
            expect(learningContentInstance.background).toBeObservable();
            expect(learningContentInstance.background.width).toBeObservable();
            expect(learningContentInstance.background.height).toBeObservable();
            expect(learningContentInstance.background.isLoading).toBeObservable();
            expect(learningContentInstance.background.onload).toBeFunction();
            expect(learningContentInstance.hasFocus()).toBeFalsy();
            expect(learningContentInstance.isDeleted).toBeFalsy();
            expect(learningContentInstance.canBeAdded()).toBeTruthy();
            expect(learningContentInstance.updateLearningContent).toBeFunction();
            expect(learningContentInstance.endEditLearningContent).toBeFunction();
            expect(learningContentInstance.removeLearningContent).toBeFunction();
            expect(learningContentInstance.addPolygon).toBeFunction();
            expect(learningContentInstance.updatePolygon).toBeFunction();
            expect(learningContentInstance.deletePolygon).toBeFunction();
            expect(learningContentInstance.uploadBackground).toBeFunction();
            expect(learningContentInstance.updateHotspotOnAnImage).toBeFunction();
            expect(learningContentInstance.remove).toBeFunction();
        });

        describe('when learning content is already saved on server', function() {
            var data = null,
                learningContentFromServer = {
                    id: 'hotspotId',
                    text: 'text',
                    type: constants.learningContentsTypes.hotspot
                },
                learningContentInstanceFromServer = null;

            beforeEach(function () {
                data = {
                    background: 'url',
                    polygons: []
                };
                learningContent.id = null;
                spyOn(hotspotParser, 'getViewModelData').and.returnValue(data);
            });

            it('should parse data', function() {
                learningContentInstanceFromServer = new HotspotOnAnImage(learningContentFromServer, _questionId, _questionType, canBeAddedImmediately);
                expect(hotspotParser.getViewModelData).toHaveBeenCalledWith(learningContentFromServer.text);
            });

            it('should set background', function () {
                learningContentInstanceFromServer = new HotspotOnAnImage(learningContentFromServer, _questionId, _questionType, canBeAddedImmediately);
                expect(learningContentInstanceFromServer.background()).toBe(data.background);
            });

            it('should start load background', function() {
                learningContentInstanceFromServer.background.isLoading(false);
                learningContentInstanceFromServer = new HotspotOnAnImage(learningContentFromServer, _questionId, _questionType, canBeAddedImmediately);
                expect(learningContentInstanceFromServer.background.isLoading()).toBeTruthy();
            });

            it('should set polygons', function() {
                learningContentInstanceFromServer = new HotspotOnAnImage(learningContentFromServer, _questionId, _questionType, canBeAddedImmediately);
                expect(learningContentInstanceFromServer.polygons().length).toBe(0);
            });

        });

        describe('when learning content is already added', function() {
            var learningContentAdded = {
                type: constants.learningContentsTypes.hotspot
            },
                learningContentInstanceAdded = null;

            it('should send event \'Add hotspot content block\'', function () {
                learningContentInstanceAdded = new HotspotOnAnImage(learningContentAdded, _questionId, _questionType, canBeAddedImmediately);
                expect(eventTracker.publish).toHaveBeenCalledWith('Add hotspot content block');
            });

            it('should set focus to field', function() {
                learningContentInstanceAdded = new HotspotOnAnImage(learningContentAdded, _questionId, _questionType, canBeAddedImmediately);
                expect(learningContentInstanceAdded.hasFocus()).toBeTruthy();
            });

            it('should call uploadBackground', function () {
                learningContentInstanceAdded = new HotspotOnAnImage(learningContentAdded, _questionId, _questionType, canBeAddedImmediately);
                expect(imageUpload.upload).toHaveBeenCalled();
            });
        });

        describe('addPolygon:', function () {

            it('should add polygon', function () {
                learningContentInstance.addPolygon({});
                expect(learningContentInstance.polygons().length).toBe(1);
            });

            it('should send event \'Add rectangle in hotspot content block\'', function () {
                learningContentInstance.addPolygon({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Add rectangle in hotspot content block');
            });

            it('should send event \'Add rectangle in hotspot content block\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new HotspotOnAnImage(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                learningContentInstance2.addPolygon({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Add rectangle in hotspot content block', 'Information');
            });

        });

        describe('updatePolygon:', function () {

            var polygon;

            beforeEach(function () {
                polygon = {
                    id: 1,
                    points: ko.observable({ x: 0 })
                };

                learningContentInstance.polygons([]);
                learningContentInstance.polygons.push(polygon);
            });

            it('should update polygon', function () {
                learningContentInstance.updatePolygon(1, { x: 10 });
                expect(learningContentInstance.polygons()[0].points().x).toBe(10);
            });

            it('should send event \'Resize/move rectangle in hotspot content block\'', function () {
                learningContentInstance.updatePolygon(1, { x: 10 });
                expect(eventTracker.publish).toHaveBeenCalledWith('Resize/move rectangle in hotspot content block');
            });

            it('should send event \'Resize/move rectangle in hotspot content block\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new HotspotOnAnImage(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                learningContentInstance2.polygons([]);
                learningContentInstance2.polygons.push(polygon);
                learningContentInstance2.updatePolygon(1, { x: 10 });
                expect(eventTracker.publish).toHaveBeenCalledWith('Resize/move rectangle in hotspot content block', 'Information');
            });

        });

        describe('deletePolygon:', function () {

            var polygon;

            beforeEach(function () {
                polygon = {
                    id: 1,
                    points: ko.observable({ x: 0 }),
                    removed: function () { }
                };

                learningContentInstance.polygons([]);
                learningContentInstance.polygons.push(polygon);
                spyOn(polygon, 'removed');
            });

            it('should delete polygon', function () {
                learningContentInstance.deletePolygon(1);
                expect(learningContentInstance.polygons().length).toBe(0);
            });

            it('should call removed from polygon', function () {
                learningContentInstance.deletePolygon(1);
                expect(polygon.removed).toHaveBeenCalled();
            });

            it('should send event \'Delete rectangle in hotspot content block\'', function () {
                learningContentInstance.deletePolygon(1);
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete rectangle in hotspot content block');
            });

            it('should send event \'Delete rectangle in hotspot content block\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new HotspotOnAnImage(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                learningContentInstance2.polygons([]);
                learningContentInstance2.polygons.push(polygon);
                learningContentInstance2.deletePolygon(1);
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete rectangle in hotspot content block', 'Information');
            });

        });

        describe('updateHotspotOnAnImage:', function () {

            var text = 'text2dsad';

            beforeEach(function () {
                spyOn(hotspotParser, 'updateHotspotOnAnImage').and.returnValue(text);
            });

            it('should call parser update', function () {
                learningContentInstance.updateHotspotOnAnImage();
                expect(hotspotParser.updateHotspotOnAnImage).toHaveBeenCalledWith(learningContentInstance.text, learningContentInstance.background, learningContentInstance.polygons);
            });

            describe('when text is not equal original text', function () {

                it('should update text', function () {
                    learningContentInstance.updateHotspotOnAnImage();
                    expect(learningContentInstance.text()).toBe(text);
                });

                it('should call updateText', function () {

                    learningContentInstance.updateHotspotOnAnImage();
                    expect(learningContentInstance.updateLearningContent).toHaveBeenCalled();
                });

            });

        });

        describe('background.onload:', function () {

            beforeEach(function () {
                spyOn(learningContentInstance, 'deletePolygon');
                spyOn(learningContentInstance, 'updatePolygon');
                spyOn(learningContentInstance, 'updateHotspotOnAnImage');
            });

            var width = 500;
            var height = 500;
            var minPolygonSize = 10;

            it('should stop loading', function() {
                learningContentInstance.background.isLoading(true);

                learningContentInstance.background.onload(width, height);

                expect(learningContentInstance.background.isLoading()).toBeFalsy();
            });

            it('should not change polygons which are in bounds', function () {
                var polygon = {
                    id: 'id',
                    points: ko.observableArray([
                        { x: 1, y: 1 },
                        { x: 1, y: 10 },
                        { x: 10, y: 10 },
                        { x: 10, y: 1 }
                    ])
                };
                learningContentInstance.polygons([polygon]);

                learningContentInstance.background.onload(width, height);

                expect(learningContentInstance.polygons().length).toBe(1);

                expect(learningContentInstance.polygons()[0].points()).toBe(polygon.points());

            });

            it('should remove polygons which are out of bounds', function () {
                var polygon = {
                    id: 'id',
                    points: ko.observableArray([
                        { x: 1001, y: 1001 },
                        { x: 1001, y: 1010 },
                        { x: 1010, y: 1010 },
                        { x: 1010, y: 1001 }
                    ])
                };
                learningContentInstance.polygons([polygon]);
                learningContentInstance.background.onload(width, height);

                expect(learningContentInstance.deletePolygon).toHaveBeenCalledWith(polygon.id);
            });

            it('should remove polygons which are smaller then the minimal size', function () {
                var polygon = {
                    id: 'id',
                    points: ko.observableArray([
                        { x: width - minPolygonSize, y: height - minPolygonSize },
                        { x: width - minPolygonSize, y: height + minPolygonSize },
                        { x: width + minPolygonSize, y: height + minPolygonSize },
                        { x: width + minPolygonSize, y: height - minPolygonSize }
                    ])
                };

                learningContentInstance.polygons([polygon]);
                learningContentInstance.background.onload(width, height);

                expect(learningContentInstance.deletePolygon).toHaveBeenCalledWith(polygon.id);
            });

            it('should edit polygons which are partly out of bounds', function () {
                var polygon = {
                    id: 'id',
                    points: ko.observableArray([
                        { x: 1, y: 1 },
                        { x: 1, y: 1010 },
                        { x: 1010, y: 1010 },
                        { x: 1010, y: 1 }
                    ])
                };
                var correctPoints = [
                    { x: 1, y: 1 },
                    { x: 1, y: height },
                    { x: width, y: height },
                    { x: width, y: 1 }
                ];
                learningContentInstance.polygons([polygon]);
                learningContentInstance.background.onload(width, height);

                expect(learningContentInstance.updatePolygon).toHaveBeenCalledWith(polygon.id, correctPoints);
            });
        });

        describe('uploadBackground:', function () {

            beforeEach(function () {
                spyOn(uiLocker, 'lock');
                spyOn(uiLocker, 'unlock');
            });

            it('should upload image', function () {
                learningContentInstance.uploadBackground();
                expect(imageUpload.upload).toHaveBeenCalled();
            });

            describe('when image upload started', function () {

                beforeEach(function () {
                    imageUploadFake = function (spec) {
                        spec.startLoading();
                    };
                });

                it('should lock ui', function () {
                    learningContentInstance.uploadBackground();
                    expect(uiLocker.lock).toHaveBeenCalled();
                });
            });

            describe('when image upload finished successfully', function () {

                var url = 'http://xxx.com';

                beforeEach(function () {
                    imageUploadFake = function (spec) {
                        spec.success(url);
                    };
                });

                it('should update background url', function () {
                    learningContentInstance.background(undefined);

                    learningContentInstance.uploadBackground();

                    expect(learningContentInstance.background()).toEqual(url);
                });


                it('should send event \'Change background of hotspot content block\'', function () {
                    learningContentInstance.uploadBackground();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change background of hotspot content block');
                });

                it('should send event \'Change background of hotspot content block\' with category \'Information\' for informationContent question type', function () {
                    var learningContentInstance2 = new HotspotOnAnImage(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                    learningContentInstance2.uploadBackground();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change background of hotspot content block', 'Information');
                });


                it('should start load image', function () {
                    learningContentInstance.background.isLoading(false);
                    learningContentInstance.uploadBackground();
                    expect(learningContentInstance.background.isLoading()).toBeTruthy();
                });
            });

            describe('when image upload finished', function () {

                beforeEach(function () {
                    imageUploadFake = function (spec) {
                        spec.complete();
                    };
                });

                it('should unlock ui', function () {
                    learningContentInstance.uploadBackground();
                    expect(uiLocker.unlock).toHaveBeenCalled();
                });
            });

        });

        describe('remove:', function () {

            it('should send event \'Delete hotspot content block\'', function () {
                learningContentInstance.remove();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete hotspot content block');
            });

            it('should send event \'Delete hotspot content block\' with category \'Information\' for informationContent question type', function () {
                var learningContentInstance2 = new HotspotOnAnImage(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                spyOn(learningContentInstance2, 'removeLearningContent').and.callFake(function () { });
                learningContentInstance2.remove();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete hotspot content block', 'Information');
            });

            it('should call removeLearningContent', function () {
                learningContentInstance.remove();
                expect(learningContentInstance.removeLearningContent).toHaveBeenCalled();
            });

        });

        describe('restore:', function () {

            describe('when content is not removed', function () {

                beforeEach(function () {
                    learningContentInstance.isRemoved(false);
                });

                it('should not publish event', function () {
                    learningContentInstance.restore();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

                it('should not restore content', function () {
                    learningContentInstance.restore();
                    expect(learningContentInstance.restoreLearningContent).not.toHaveBeenCalled();
                });

            });

            it('should send event \'Undo delete hotspot content block\'', function () {
                learningContentInstance.isRemoved(true);
                learningContentInstance.restore();
                expect(eventTracker.publish).toHaveBeenCalledWith('Undo delete hotspot content block');
            });

            it('should send event \'Undo delete hotspot content block\' with category \'Information\' for informationContent question type', function () {
                var learnContent = new HotspotOnAnImage(learningContent, _questionId, 'informationContent', canBeAddedImmediately);
                spyOn(learnContent, 'restoreLearningContent');
                learnContent.isRemoved(true);
                learnContent.restore();
                expect(eventTracker.publish).toHaveBeenCalledWith('Undo delete hotspot content block', 'Information');
            });

            it('should call restoreLearningContent', function () {
                learningContentInstance.isRemoved(true);
                learningContentInstance.restore();
                expect(learningContentInstance.restoreLearningContent).toHaveBeenCalled();
            });

        });

    });

});
