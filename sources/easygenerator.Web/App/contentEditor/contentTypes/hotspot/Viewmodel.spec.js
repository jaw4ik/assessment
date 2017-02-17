import Viewmodel from './Viewmodel';
import uploadImage from 'images/commands/upload';
import hotspotParser from './components/hotspotParser';
import eventTracker from 'eventTracker';
import uiLocker from 'uiLocker';
import notify from 'notify';

describe('viewmodel hotspotOnImage', () => {
    let hotspotOnImage;
    let imageUploadFake;

    beforeEach(() => {
        hotspotOnImage = new Viewmodel();
        imageUploadFake = (spec) => {};
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
    });

    it('should return ctor function', () => {
        expect(Viewmodel).toBeFunction();
    });

    describe('ctor', () => {
        it('shoud init fields', () => {
            expect(hotspotOnImage.polygons).toBeObservableArray;
            expect(hotspotOnImage.background).toBeObservable();
            expect(hotspotOnImage.background.width).toBeObservable();
            expect(hotspotOnImage.background.height).toBeObservable();
            expect(hotspotOnImage.background.isLoading).toBeObservable();
            expect(hotspotOnImage.background.onload).toBeFunction();
            expect(hotspotOnImage.data).toBeObservable();
            expect(hotspotOnImage.data()).toBeNull();
            expect(hotspotOnImage.hasFocus).toBeObservable();
            expect(hotspotOnImage.hasFocus()).toBe(false);
            expect(_.any(hotspotOnImage.buttonsPanel.buttons, (buttonInPanel) => { return buttonInPanel.cssClass === 'change-image' && buttonInPanel.resourceKey === 'changeImage';})).toBeTruthy();
        });
    });

    describe('hasFocus', () => {
        beforeEach(() => {
            spyOn(hotspotOnImage, 'startEditing');
            spyOn(hotspotOnImage, 'endEditing');
        });

        it('should call startEditing if value was changed to true', () => {
            hotspotOnImage.hasFocus(true);
            expect(hotspotOnImage.startEditing).toHaveBeenCalled();
        });

        it('should call endEditing if value was changed to false', () => {
            hotspotOnImage.hasFocus(true);
            hotspotOnImage.hasFocus(false);
            expect(hotspotOnImage.endEditing).toHaveBeenCalled();
        });
    });

    describe('background', () => {
        it('should set isLoading to true when changed', () => {
            hotspotOnImage.background.isLoading(false);
            hotspotOnImage.background('test');
            expect(hotspotOnImage.background.isLoading()).toBeTruthy();
        });
    });

    describe('activate', () => {
        describe('when data is empty and justCreated is true', () => {
            it('has to set hasFocus to true', () => {
                hotspotOnImage.activate('', true);
                expect(hotspotOnImage.hasFocus()).toBeTruthy();
            });
        });

        describe('when not just created by owner with empty data', () => {

            let data = null;
            let dataText = 'dataText';

            beforeEach(() => {
                data = {
                    background: 'url',
                    polygons: []
                };
                spyOn(hotspotParser, 'getViewModelData').and.returnValue(data);
            });

            it('should parse data', () => {
                hotspotOnImage.activate(dataText);
                expect(hotspotParser.getViewModelData).toHaveBeenCalledWith(dataText);
            });

            it('should set background', () => {
                hotspotOnImage.activate(dataText);
                expect(hotspotOnImage.background()).toBe(data.background);
            });

            it('should set polygons', () => {
                hotspotOnImage.activate(dataText);
                expect(hotspotOnImage.polygons().length).toBe(0);
            });

            it('should set data', () => {
                hotspotOnImage.activate(dataText);
                expect(hotspotOnImage.data()).toBe(data);
            });
        });
    });

    describe('background.onload', () => {

        beforeEach(() => {
            spyOn(hotspotOnImage, 'deletePolygon');
            spyOn(hotspotOnImage, 'updatePolygon');
            spyOn(hotspotOnImage, 'updateHotspotOnAnImage');
        });

        let width = 500;
        let height = 500;
        let minPolygonSize = 10;

        it('should stop loading', () => {
            hotspotOnImage.background.isLoading(true);

            hotspotOnImage.background.onload(width, height);

            expect(hotspotOnImage.background.isLoading()).toBeFalsy();
        });

        describe('when all polygons are in bounds', () => {
            var polygon = {
                id: 'id',
                points: ko.observableArray([])
            };

            beforeEach(() => {
                polygon.points([
                    { x: 0, y: 0 },
                    { x: 0, y: 11 },
                    { x: 11, y: 11 },
                    { x: 11, y: 0 }
                ]);
                hotspotOnImage.polygons([polygon]);
                hotspotOnImage.background.onload(width, height);
            });

            it('should not change polygons which are in bounds', () => {
                expect(hotspotOnImage.polygons().length).toBe(1);
                expect(hotspotOnImage.polygons()[0].points()).toBe(polygon.points());
            });

            it('should not update HotspotOnAnImage ', () => {
                expect(hotspotOnImage.updateHotspotOnAnImage).not.toHaveBeenCalled();
            });
        });

        describe('when polygons are out of bounds ', () => {
            var polygon = {
                id: 'id',
                points: ko.observableArray([])
            };

            beforeEach(() => {
                polygon.points([
                    { x: 1001, y: 1001 },
                    { x: 1001, y: 1010 },
                    { x: 1010, y: 1010 },
                    { x: 1010, y: 1001 }
                ]);
                hotspotOnImage.polygons([polygon]);
                hotspotOnImage.background.onload(width, height);
            });
            
            it('should remove polygons', () => {
                expect(hotspotOnImage.deletePolygon).toHaveBeenCalledWith(polygon.id);
            });
            
            it('should update HotspotOnAnImage ', () => {
                expect(hotspotOnImage.updateHotspotOnAnImage).toHaveBeenCalled();
            });
        });

        describe('when polygons are smaller then the minimal size', () => {
            var polygon = {
                id: 'id',
                points: ko.observableArray([])
            };

            beforeEach(() => {
                polygon.points([
                    { x: width - minPolygonSize, y: height - minPolygonSize },
                    { x: width - minPolygonSize, y: height + minPolygonSize },
                    { x: width + minPolygonSize, y: height + minPolygonSize },
                    { x: width + minPolygonSize, y: height - minPolygonSize }
                ]);
                hotspotOnImage.polygons([polygon]);
                hotspotOnImage.background.onload(width, height);    
            });
            
            it('should remove polygons', () => {
                expect(hotspotOnImage.deletePolygon).toHaveBeenCalledWith(polygon.id);    
            });
            
            it('should update HotspotOnAnImage ', () => {
                expect(hotspotOnImage.updateHotspotOnAnImage).toHaveBeenCalled();
            });
        });

        describe('when polygons are partly out of bounds', () => {
            var polygon = {
                id: 'id',
                points: ko.observableArray([])
            },
            correctPoints = [
                { x: 1, y: 1 },
                { x: 1, y: height },
                { x: width, y: height },
                { x: width, y: 1 }
            ];

            beforeEach(() => {
                polygon.points([
                    { x: 1, y: 1 },
                    { x: 1, y: 1010 },
                    { x: 1010, y: 1010 },
                    { x: 1010, y: 1 }
                ]);
                hotspotOnImage.polygons([polygon]);
                hotspotOnImage.background.onload(width, height);
            });

            it('should edit polygons', () => {
                expect(hotspotOnImage.updatePolygon).toHaveBeenCalledWith(polygon.id, correctPoints);
            });
            
            it('should update HotspotOnAnImage ', () => {
                expect(hotspotOnImage.updateHotspotOnAnImage).toHaveBeenCalled();
            });
        });
    });

    describe('addPolygon:', () => {

        it('should add polygon', () => {
            hotspotOnImage.addPolygon({});
            expect(hotspotOnImage.polygons().length).toBe(1);
        });

        it('should send event \'Add rectangle in hotspot content block\'', () => {
            hotspotOnImage.addPolygon({});
            expect(eventTracker.publish).toHaveBeenCalledWith('Add rectangle in hotspot content block');
        });
    });

    describe('updatePolygon:', () => {

        let polygon;

        beforeEach(() => {
            polygon = {
                id: 1,
                points: ko.observable({ x: 0 })
            };

            hotspotOnImage.polygons([]);
            hotspotOnImage.polygons.push(polygon);
        });

        it('should update polygon', () => {
            hotspotOnImage.updatePolygon(1, { x: 10 });
            expect(hotspotOnImage.polygons()[0].points().x).toBe(10);
        });

        it('should send event \'Resize/move rectangle in hotspot content block\'', () => {
            hotspotOnImage.updatePolygon(1, { x: 10 });
            expect(eventTracker.publish).toHaveBeenCalledWith('Resize/move rectangle in hotspot content block');
        });
    });

    describe('deletePolygon:', () => {

        let polygon;

        beforeEach(() => {
            polygon = {
                id: 1,
                points: ko.observable({ x: 0 }),
                removed: () => { }
            };

            hotspotOnImage.polygons([]);
            hotspotOnImage.polygons.push(polygon);
            spyOn(polygon, 'removed');
        });

        it('should delete polygon', () => {
            hotspotOnImage.deletePolygon(1);
            expect(hotspotOnImage.polygons().length).toBe(0);
        });

        it('should call removed from polygon', () => {
            hotspotOnImage.deletePolygon(1);
            expect(polygon.removed).toHaveBeenCalled();
        });

        it('should send event \'Delete rectangle in hotspot content block\'', () => {
            hotspotOnImage.deletePolygon(1);
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete rectangle in hotspot content block');
        });
    });

    describe('uploadBackground:', () => {

        let file;

        beforeEach(function () {
            file = 'some image file';
            spyOn(uiLocker, 'lock');
            spyOn(uiLocker, 'unlock');
        });

        it('should lock ui', () => {
            hotspotOnImage.uploadBackground();
            expect(uiLocker.lock).toHaveBeenCalled();
        });

        describe('when image upload successfull', () => {
            
            let uploadImagePromise;
            let imageUploadRes;

            beforeEach(() => {
                imageUploadRes = {
                    id: 'someid',
                    title: 'title',
                    url: 'https://urla.com'
                };
                uploadImagePromise = Promise.resolve(imageUploadRes);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should upload image to image storage', () => {
                hotspotOnImage.uploadBackground(file);
                expect(uploadImage.execute).toHaveBeenCalledWith(file);
            });

            it('should send event \'Change background of hotspot content block\'', done => (async () => {
                hotspotOnImage.uploadBackground(file);
                await uploadImagePromise;
                expect(eventTracker.publish).toHaveBeenCalledWith('Change background of hotspot content block');
            })().then(done));

            it('should update hotspot background', done => (async () => {
                hotspotOnImage.uploadBackground(file);
                await uploadImagePromise;
                expect(hotspotOnImage.background()).toBe(imageUploadRes.url);
            })().then(done));

            it('should update hotspot on an image', done => (async () => {
                spyOn(hotspotOnImage, 'updateHotspotOnAnImage');
                hotspotOnImage.uploadBackground(file);
                await uploadImagePromise;
                expect(hotspotOnImage.updateHotspotOnAnImage).toHaveBeenCalled();
            })().then(done));

            it('should show message about saving', done => (async () => {
                hotspotOnImage.uploadBackground(file);
                await uploadImagePromise;
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

            it('should unlock ui', done => (async () => {
                hotspotOnImage.uploadBackground(file);
                await uploadImagePromise;
                expect(uiLocker.unlock).toHaveBeenCalled();
            })().then(done));

        });

        describe('when image upload successfull', () => {
            
            let uploadImagePromise;
            let reason;

            beforeEach(() => {
                reason = 'some reject reason';
                uploadImagePromise = Promise.reject(reason);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should show error message', done => (async () => {
                try {
                    hotspotOnImage.uploadBackground(file);
                    await uploadImagePromise;
                } catch (e) {
                    expect(notify.error).toHaveBeenCalledWith(reason);
                    expect(e).toBe(reason);
                }
            })().then(done).catch(done));

            it('should unlock ui', done => (async () => {
                try {
                    hotspotOnImage.uploadBackground(file);
                    await uploadImagePromise;
                } catch (e) {
                    expect(uiLocker.unlock).toHaveBeenCalled();
                    expect(e).toBe(reason);
                }
            })().then(done).catch(done));
        });
    });

    describe('editingEnded:', () => {

        it('should set hasFocus to false', () => {
            hotspotOnImage.hasFocus(true);
            hotspotOnImage.editingEnded();
            expect(hotspotOnImage.hasFocus()).toBeFalsy();
        });

    });
});