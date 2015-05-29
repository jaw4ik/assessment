define(['knockout', 'viewmodels/learningContents/hotspotOnAnImage'], function (ko, HotspotOnAnImage) {
    'use strict';

    var app = require('durandal/app'),
        constants = require('constants'),
        uiLocker = require('uiLocker'),
        imageUpload = require('imageUpload'),
        hotspotParser = require('viewmodels/learningContents/components/hotspotParser'),
        PolygonModel = require('viewmodels/learningContents/components/polygonModel');

    describe('viewmodel HotspotOnAnImage', function () {

        var _questionId = 'questionId',
            _questionType = 'questionType',
            canBeAddedImmediately = false;

        describe('when learningContent is defined in database', function() {
            var learningContent = {
                    id: 'hotspotId',
                    text: 'text',
                    type: constants.learningContentsTypes.hotspot
                },
                ctor = null;

            beforeEach(function() {
                ctor = new HotspotOnAnImage(learningContent, _questionId, _questionType, canBeAddedImmediately);
                spyOn(app, 'trigger');
            });

            it('should initialize field', function() {
                expect(ctor.id()).toBe(learningContent.id);
                expect(ctor.text()).toBe(learningContent.text);
                expect(ctor.originalText).toBe(learningContent.text);
                expect(ctor.type).toBe(learningContent.type);
                expect(ctor.polygons).toBeObservableArray();
                expect(ctor.background).toBeObservable();
                expect(ctor.background.width).toBeObservable();
                expect(ctor.background.height).toBeObservable();
                expect(ctor.background.onload).toBeFunction();
                expect(ctor.hasFocus()).toBeFalsy();
                expect(ctor.isDeleted).toBeFalsy();
                expect(ctor.canBeAdded()).toBeTruthy();
                expect(ctor.beginEditText).toBeFunction();
                expect(ctor.updateText).toBeFunction();
                expect(ctor.endEditText).toBeFunction();
                expect(ctor.removeLearningContent).toBeFunction();
                expect(ctor.addPolygon).toBeFunction();
                expect(ctor.updatePolygon).toBeFunction();
                expect(ctor.deletePolygon).toBeFunction();
                expect(ctor.uploadBackground).toBeFunction();
                expect(ctor.save).toBeFunction();
            });

            describe('addPolygon:', function () {

                it('should add polygon', function() {
                    ctor.addPolygon({});
                    expect(ctor.polygons().length).toBe(1);
                });

            });

            describe('updatePolygon:', function () {

                it('should update polygon', function() {
                    var polygon = {
                        id: 1,
                        points: ko.observable({ x: 0 })
                    };

                    ctor.polygons([]);
                    ctor.polygons.push(polygon);
                    ctor.updatePolygon(1, { x: 10 });
                    expect(ctor.polygons()[0].points().x).toBe(10);
                });

            });

            describe('deletePolygon:', function () {

                it('should delete polygon', function() {
                    var polygon = {
                        id: 1,
                        points: ko.observable({ x: 0 })
                    };

                    ctor.polygons([]);
                    ctor.polygons.push(polygon);
                    ctor.deletePolygon(1);
                    expect(ctor.polygons().length).toBe(0);
                });

            });

            describe('save:', function () {

                var text = 'text2dsad';

                beforeEach(function() {
                    spyOn(hotspotParser, 'updateHotspotOnAnImage').and.returnValue(text);
                });

                it('should call parser update', function() {
                    ctor.save();
                    expect(hotspotParser.updateHotspotOnAnImage).toHaveBeenCalledWith(ctor.text, ctor.background, ctor.polygons);
                });

                describe('when text is not equal original text', function() {
                    
                    it('should update text', function() {
                        ctor.save();
                        expect(ctor.text()).toBe(text);
                    });

                    it('should call updateText', function () {
                        spyOn(ctor, 'updateText');
                        ctor.save();
                        expect(ctor.updateText).toHaveBeenCalled();
                    });

                });

            });

            describe('background.onload:', function () {

                beforeEach(function () {
                    spyOn(ctor, 'deletePolygon');
                    spyOn(ctor, 'updatePolygon');
                });

                var width = 500;
                var height = 500;
                var minPolygonSize = 10;

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
                    ctor.polygons([polygon]);

                    ctor.background.onload(width, height);

                    expect(ctor.polygons().length).toBe(1);

                    expect(ctor.polygons()[0].points()).toBe(polygon.points());

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
                    ctor.polygons([polygon]);
                    ctor.background.onload(width, height);

                    expect(ctor.deletePolygon).toHaveBeenCalledWith(polygon.id);
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

                    ctor.polygons([polygon]);
                    ctor.background.onload(width, height);

                    expect(ctor.deletePolygon).toHaveBeenCalledWith(polygon.id);
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
                    ctor.polygons([polygon]);
                    ctor.background.onload(width, height);

                    expect(ctor.updatePolygon).toHaveBeenCalledWith(polygon.id, correctPoints);
                });
            });

            describe('uploadBackground:', function () {

                beforeEach(function () {
                    spyOn(uiLocker, 'lock');
                    spyOn(uiLocker, 'unlock');
                });

                it('should upload image', function () {
                    spyOn(imageUpload, 'upload');
                    ctor.uploadBackground();
                    expect(imageUpload.upload).toHaveBeenCalled();
                });

                describe('when image upload started', function () {

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.startLoading();
                        });
                    });

                    it('should lock ui', function () {
                        ctor.uploadBackground();
                        expect(uiLocker.lock).toHaveBeenCalled();
                    });
                });

                describe('when image upload finished successfully', function () {

                    var url = 'http://xxx.com';

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.success(url);
                        });
                    });

                    it('should update background url', function () {
                        ctor.background(undefined);

                        ctor.uploadBackground();

                        expect(ctor.background()).toEqual(url);
                    });

                });

                describe('when image upload finished', function () {

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.complete();
                        });
                    });

                    it('should unlock ui', function () {
                        ctor.uploadBackground();
                        expect(uiLocker.unlock).toHaveBeenCalled();
                    });
                });

            });

        });
    });


});