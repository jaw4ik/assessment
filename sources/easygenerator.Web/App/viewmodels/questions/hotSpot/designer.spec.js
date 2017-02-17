﻿import designer from './designer';

import changeTypeCommand from './commands/changeType';
import changeBackgroundCommand from './commands/changeBackground';
import addPolygonCommand from './commands/addPolygon';
import removePolygonCommand from './commands/removePolygon';
import getQuestionContentByIdQuery from './queries/getQuestionContentById';
import eventTracker from 'eventTracker';
import uploadImage from 'images/commands/upload';
import notify from 'notify';
import uiLocker from 'uiLocker';

describe('viewmodel [designer] (hotspot)', function () {

    it('should be object', function () {
        expect(designer).toBeObject();
    });

    describe('isMultiple:', function () {

        it('should be observable', function () {
            expect(designer.isMultiple).toBeObservable();
        });

    });

    describe('isLoading:', function () {
        it('should be observable', function () {
            expect(designer.background.isLoading).toBeObservable();
        });
    });

    describe('changeType:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(changeTypeCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
            spyOn(designer, 'removePolygon');
        });

        it('should be function', function () {
            expect(designer.changeType).toBeFunction();
        });
            
        it('should set isLoading to false', function () {
            var width = 10;
            var height = 100;
            designer.background.isLoading(true);
            designer.background.onload(width, height);

            expect(designer.background.isLoading()).toBeFalsy();
        });
            
        it('should return promise', function () {
            expect(designer.changeType()).toBePromise();
        });

        it('should execute command to change hotspot type', function (done) {
            dfd.resolve();

            designer.changeType().then(function () {
                expect(changeTypeCommand.execute).toHaveBeenCalled();
                done();
            });
        });

        describe('and change hotspot type command is executed', function () {

            beforeEach(function () {
                dfd.resolve();
            });

            it('should notify user that everything was saved', function (done) {
                designer.changeType().then(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

            it('should track event \'Change hotspot type\'', function (done) {
                designer.changeType().then(function () {
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change hotspot type');
                    done();
                });
            });

        });
    });

    describe('background:', function () {

        it('should be observable', function () {
            expect(designer.background).toBeObservable();
        });

        describe('width:', function () {
            it('should be observable', function () {
                expect(designer.background.width).toBeObservable();
            });
        });

        describe('height:', function () {
            it('should be observable', function () {
                expect(designer.background.height).toBeObservable();
            });
        });

        describe('isDirty:', function () {
            it('should be observable', function () {
                expect(designer.background.isDirty).toBeObservable();
            });
        });

        describe('onload:', function () {

            beforeEach(() => {
                spyOn(designer, 'removePolygon');
            });

            var width = 10;
            var height = 100;

            it('should be function', function () {
                expect(designer.background.onload).toBeFunction();
            });

            it('should set new width', function () {
                designer.background.width(5);
                designer.background.onload(width, height);

                expect(designer.background.width()).toBe(width);
            });

            it('should set new height', function () {
                designer.background.height(5);
                designer.background.onload(width, height);

                expect(designer.background.height()).toBe(height);
            });

        });

    });

    describe('uploadBackground:', () => {

        let uploadImagePromise;
        let imageResult;
        let file;
        let changeBackgroundPromise;

        beforeEach(() => {
            file = 'file';
            imageResult = {
                id: 'id',
                title: 'Image.png',
                url: 'https://urlko.com'
            };
            spyOn(uiLocker, 'lock');
            spyOn(uiLocker, 'unlock');
            spyOn(notify, 'saved');
            spyOn(notify, 'error');
            spyOn(eventTracker, 'publish');
        });

        it('should lock ui', () => {
            designer.uploadBackground();
            expect(uiLocker.lock).toHaveBeenCalled();
        });

        describe('when image is uploaded successfully', () => {

            let backgroundUrl;

            beforeEach(() => {
                backgroundUrl = imageResult.url + '?width=941&height=785';
                uploadImagePromise = Promise.resolve(imageResult);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should start background loading', done => (async () => {
                designer.background.isLoading(false);
                designer.uploadBackground();
                await uploadImagePromise;
                expect(designer.background.isLoading()).toBeTruthy();
            })().then(done));

            it('should change background', done => (async () => {
                spyOn(changeBackgroundCommand, 'execute');
                designer.uploadBackground();
                await uploadImagePromise;
                expect(changeBackgroundCommand.execute).toHaveBeenCalledWith(null, backgroundUrl);
            })().then(done));

            describe('and when background is changed successfully', () => {
                
                beforeEach(() => {
                    changeBackgroundPromise = Promise.resolve();
                    spyOn(changeBackgroundCommand, 'execute').and.returnValue(changeBackgroundPromise);
                });

                it('should update background', done => (async () => {
                    designer.background(undefined);
                    designer.uploadBackground();
                    await uploadImagePromise;
                    await changeBackgroundPromise;
                    expect(designer.background()).toBe(backgroundUrl);
                })().then(done));

                it('should make background dirty', done => (async () => {
                    designer.background.isDirty(false);
                    designer.uploadBackground();
                    await uploadImagePromise;
                    await changeBackgroundPromise;
                    expect(designer.background.isDirty()).toBeTruthy();
                })().then(done));

                it('should show saved notification', done => (async () => {
                    designer.uploadBackground();
                    await uploadImagePromise;
                    await changeBackgroundPromise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));

                it('should publish event \'Change hotspot background\'', done => (async () => {
                    designer.uploadBackground();
                    await uploadImagePromise;
                    await changeBackgroundPromise;
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change hotspot background');
                })().then(done));

                it('should unlock ui', done => (async () => {
                    designer.uploadBackground();
                    await uploadImagePromise;
                    await changeBackgroundPromise;
                    expect(uiLocker.unlock).toHaveBeenCalled();
                })().then(done));

            });

            describe('and when background is not changed successfully', () => {

                let reason;

                beforeEach(() => {
                    reason = 'some reason';
                    changeBackgroundPromise = Promise.reject(reason);
                    spyOn(changeBackgroundCommand, 'execute').and.returnValue(changeBackgroundPromise);
                });

                it('should show error notification', done => (async () => {
                    try {
                        designer.uploadBackground();
                        await uploadImagePromise;
                        await changeBackgroundPromise;
                    } catch (e) {
                        expect(notify.error).toHaveBeenCalledWith(reason);
                    } 
                })().then(done));

                it('should unlock UI', done => (async () => {
                    try {
                        designer.uploadBackground();
                        await uploadImagePromise;
                        await changeBackgroundPromise;
                    } catch (e) {
                        expect(uiLocker.unlock).toHaveBeenCalled();
                    } 
                })().then(done));

            });

        });

        describe('when image is uploaded successfully', () => {

            let reason;

            beforeEach(() => {
                reason = 'some reason';
                uploadImagePromise = Promise.reject(reason);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should show error notification', done => (async () => {
                try {
                    designer.uploadBackground();
                    await uploadImagePromise;
                } catch (e) {
                    expect(notify.error).toHaveBeenCalledWith(reason);
                } 
            })().then(done));

            it('should unlock UI', done => (async () => {
                try {
                    designer.uploadBackground();
                    await uploadImagePromise;
                } catch (e) {
                    expect(uiLocker.unlock).toHaveBeenCalled();
                } 
            })().then(done));

        });

    });

    /*describe('uploadBackground:', function () {

        beforeEach(function () {
            spyOn(uiLocker, 'lock');
            spyOn(uiLocker, 'unlock');
        });

        it('should be function', function () {
            expect(designer.uploadBackground).toBeFunction();
        });

        it('should upload image', function () {
            spyOn(imageUpload, 'upload');
            designer.uploadBackground();
            expect(imageUpload.upload).toHaveBeenCalled();
        });

        describe('when image upload started', function () {

            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.startLoading();
                });
            });

            it('should lock ui', function () {
                designer.uploadBackground();
                expect(uiLocker.lock).toHaveBeenCalled();
            });
        });

        describe('when image upload finished successfully', function () {

            var url = 'http://xxx.com',
                urlParams = '?width=941&height=785',
                changeBackgroundDefer,
                questionId = null;

            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.success(url);
                });

                changeBackgroundDefer = Q.defer();
                spyOn(changeBackgroundCommand, 'execute').and.returnValue(changeBackgroundDefer.promise);

                spyOn(notify, 'saved');
                spyOn(eventTracker, 'publish');
            });

            it('should set background isLoading to true', function () {
                designer.background.isLoading(false);
                designer.uploadBackground();
                expect(designer.background.isLoading()).toBeTruthy();
            });

            it('should execute command to change background', function () {
                designer.background(undefined);
                designer.uploadBackground();
                expect(changeBackgroundCommand.execute).toHaveBeenCalledWith(questionId, url + urlParams);
            });

            describe('and command to change background was executed', function () {

                beforeEach(function () {
                    changeBackgroundDefer.resolve();
                });

                it('should update background url', function (done) {
                    designer.background(undefined);

                    designer.uploadBackground();

                    changeBackgroundDefer.promise.fin(function () {
                        expect(designer.background()).toEqual(url + urlParams);
                        done();
                    });
                });

                it('should notify user that everything was saved', function (done) {
                    designer.uploadBackground();

                    changeBackgroundDefer.promise.finally(function() {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                        
                });

                it('should track event \'Change hotspot background\'', function (done) {
                    designer.uploadBackground();

                    changeBackgroundDefer.promise.fin(function() {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Change hotspot background');
                        done();
                    });
                });

            });

        });

        describe('when image upload finished', function () {

            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.complete();
                });
            });

            it('should unlock ui', function () {
                designer.uploadBackground();
                expect(uiLocker.unlock).toHaveBeenCalled();
            });
        });

    });*/

    describe('polygons:', function () {

        it('should be observable array', function () {
            expect(designer.polygons).toBeObservableArray();
        });

    });

    describe('addPolygon:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(addPolygonCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
        });

        it('should be function', function () {
            expect(designer.addPolygon).toBeFunction();
        });

        it('should return promise', function () {
            expect(designer.addPolygon([{}, {}, {}])).toBePromise();
        });

        describe('when there are less then 3 points', function () {

            it('should throw exception', function () {
                var f = function () {
                    designer.addPolygon([]);
                };

                expect(f).toThrow();
            });

        });

        describe('when there are at least 3 points', function () {

            beforeEach(function () {
                designer.polygons.removeAll();
                dfd.resolve('id');
            });

            it('should execute command to add polygon', function (done) {
                designer.addPolygon([{}, {}, {}]).then(function () {
                    expect(addPolygonCommand.execute).toHaveBeenCalled();
                    done();
                });
            });

            describe('and add polygon command is executed', function () {

                it('should add polygon', function (done) {
                    designer.addPolygon([{}, {}, {}]).then(function () {
                        expect(designer.polygons().length).toEqual(1);
                        expect(designer.polygons()[0].id).toEqual('id');
                        done();
                    });
                });

                it('should notify user that everything was saved', function (done) {
                    designer.addPolygon([{}, {}, {}]).then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                it('should track event \'Add hotspot rectangle\'', function (done) {
                    designer.addPolygon([{}, {}, {}]).then(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Add hotspot rectangle');
                        done();
                    });
                });

            });
        });

    });

    describe('removePolygon:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(removePolygonCommand, 'execute').and.returnValue(dfd.promise);
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
        });

        it('should be function', function () {
            expect(designer.removePolygon).toBeFunction();
        });

        it('should execute command to remove polygon', function () {
            designer.removePolygon({ id: 'id' });
            expect(removePolygonCommand.execute).toHaveBeenCalled();
        });

        describe('when remove polygon command is executed', function () {

            beforeEach(function () {
                dfd.resolve();
            });

            it('should remove polygon', function (done) {
                var polygon = { id: 'id' };
                designer.polygons([polygon]);
                designer.removePolygon(polygon);

                dfd.promise.then(function () {
                    expect(designer.polygons().length).toEqual(0);
                    done();
                });
            });

            it('should notify user that everything was saved', function (done) {
                var polygon = { id: 'id' };
                designer.polygons([polygon]);
                designer.removePolygon(polygon);

                dfd.promise.then(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

            it('should track event \'Delete hotspot rectangle\'', function (done) {
                var polygon = { id: 'id' };
                designer.polygons([polygon]);
                designer.removePolygon(polygon);

                dfd.promise.then(function () {
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete hotspot rectangle');
                    done();
                });
            });

        });

    });

    describe('fitPointsIntoBounds:', function () {

        beforeEach(function () {
            spyOn(designer, 'removePolygon');
            spyOn(designer.updatePolygon, 'end');
        });

        var width = 500;
        var height = 500;
        var minPolygonSize = 10;

        it('should be function', function () {
            expect(designer.fitPointsIntoBounds).toBeFunction();
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
            designer.polygons([polygon]);

            designer.fitPointsIntoBounds(width, height);

            expect(designer.polygons().length).toBe(1);

            expect(designer.polygons()[0].points()).toBe(polygon.points());

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
            designer.polygons([polygon]);
            designer.fitPointsIntoBounds(width, height);

            expect(designer.removePolygon).toHaveBeenCalledWith(polygon);
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

            designer.polygons([polygon]);
            designer.fitPointsIntoBounds(width, height);

            expect(designer.removePolygon).toHaveBeenCalledWith(polygon);
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
            designer.polygons([polygon]);
            designer.fitPointsIntoBounds(width, height);

            expect(designer.updatePolygon.end).toHaveBeenCalledWith(polygon, correctPoints);
        });

    });

    describe('activate:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(getQuestionContentByIdQuery, 'execute').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(designer.activate).toBeFunction();
        });

        it('should return promise', function () {
            expect(designer.activate()).toBePromise();
        });

        describe('when hotspot content does not exist', function () {

            beforeEach(function () {
                dfd.resolve(undefined);
            });

            it('should clear background', function (done) {
                designer.background('background');
                designer.activate().then(function () {
                    expect(designer.background()).toBeUndefined();
                    done();
                });
            });

            it('should set an empty polygons collection', function (done) {
                designer.polygons([{}, {}, {}]);
                designer.activate().then(function () {
                    expect(designer.polygons().length).toEqual(0);
                    done();
                });
            });

        });

        describe('when hotspot content exists', function () {
                
            it('should set background isLoading to true', function (done) {
                designer.background.isLoading(false);
                dfd.resolve({ background: 'background' });

                designer.activate().then(function () {
                    expect(designer.background.isLoading()).toBeTruthy();
                    done();
                });
            });

            it('should set type', function (done) {
                designer.isMultiple(undefined);
                dfd.resolve({ isMultiple: 'true' });

                designer.activate().then(function () {
                    expect(designer.isMultiple()).toBeTruthy();
                    done();
                });
            });

            it('should set background image', function (done) {
                designer.background(undefined);
                dfd.resolve({ background: 'background' });

                designer.activate().then(function () {
                    expect(designer.background()).toEqual('background');
                    done();
                });
            });

            it('should set polygons collection', function (done) {
                designer.polygons([]);
                dfd.resolve({ polygons: [{ id: 'id#1', points: "[{}, {}, {}]" }, { id: 'id#2', points: "[{}, {}, {}]" }] });

                designer.activate().then(function () {
                    expect(designer.polygons().length).toEqual(2);
                    done();
                });
            });

        });

    });

    describe('isExpanded:', function () {

        it('should be observable', function () {
            expect(designer.isExpanded).toBeObservable();
        });

        it('should be true by default', function () {
            expect(designer.isExpanded()).toBeTruthy();
        });

    });

    describe('toggleExpand:', function () {

        it('should be function', function () {
            expect(designer.toggleExpand).toBeFunction();
        });

        it('should toggle isExpanded value', function () {
            designer.isExpanded(false);
            designer.toggleExpand();
            expect(designer.isExpanded()).toEqual(true);
        });

    });

});
