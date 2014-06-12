define(['viewmodels/questions/dragAndDrop/designer'], function (designer) {

    var
        imageUpload = require('imageUpload'),
        notify = require('notify'),
        dropspotToAdd = require('viewmodels/questions/dragAndDrop/dropspotToAdd'),
        addDropspotCommand = require('viewmodels/questions/dragAndDrop/commands/addDropspot'),
        removeDropspotCommand = require('viewmodels/questions/dragAndDrop/commands/removeDropspot')
    ;

    describe('viewmodel [desiger]', function () {

        it('should be oobject', function () {
            expect(designer).toBeObject();
        });

        describe('background:', function () {

            it('should be observable', function () {
                expect(designer.background).toBeObservable();
            });

        });

        describe('uploadBackground', function () {

            it('should be function', function () {
                expect(designer.uploadBackground).toBeFunction();
            });

            it('should upload image', function () {
                spyOn(imageUpload, 'upload');
                designer.uploadBackground();
                expect(imageUpload.upload).toHaveBeenCalled();
            });

            describe('when image was uploaded', function () {

                var url = 'http://xxx.com';

                beforeEach(function () {
                    spyOn(notify, 'saved');
                    spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                        spec.success(url);
                    });
                });

                it('should update background url', function () {
                    designer.background(undefined);
                    designer.uploadBackground();
                    expect(designer.background()).toEqual(url);
                });

                it('should notify user that everything was saved', function () {
                    designer.uploadBackground();
                    expect(notify.saved).toHaveBeenCalled();
                });

            });

        });

        describe('dropspots:', function () {

            it('should be observable array', function () {
                expect(designer.dropspots).toBeObservableArray();
            });

        });

        describe('dropspotToAdd:', function () {

            it('should be observable', function () {
                expect(designer.dropspotToAdd).toBeObservable();
            });

        });

        describe('addDropspot:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(addDropspotCommand, 'execute').and.returnValue(dfd.promise);
                spyOn(notify, 'saved');
            });

            it('should be function', function () {
                expect(designer.addDropspot).toBeFunction();
            });

            describe('when dropspotToAdd is not valid', function () {

                beforeEach(function () {
                    spyOn(dropspotToAdd, 'isValid').and.returnValue(false);
                    spyOn(dropspotToAdd, 'clear');
                    spyOn(dropspotToAdd, 'hide');
                });

                it('should not execute command to add dropspot', function () {
                    designer.addDropspot();
                    expect(addDropspotCommand.execute).not.toHaveBeenCalled();
                });

                it('should clear dropspotToAdd', function () {
                    designer.addDropspot();
                    expect(dropspotToAdd.clear).toHaveBeenCalled();
                });

                it('should hide dropspotToAdd', function () {
                    designer.addDropspot();
                    expect(dropspotToAdd.hide).toHaveBeenCalled();
                });

            });

            describe('when dropspotToAdd is valid', function () {

                beforeEach(function () {
                    spyOn(dropspotToAdd, 'isValid').and.returnValue(true);
                });

                it('should execute command to add dropspot', function () {
                    designer.dropspotToAdd("dropspot");
                    designer.addDropspot();
                    expect(addDropspotCommand.execute).toHaveBeenCalled();
                });

                describe('and add dropspot command is executed', function () {

                    beforeEach(function (done) {
                        spyOn(dropspotToAdd, 'clear');
                        spyOn(dropspotToAdd, 'hide');
                        designer.dropspotToAdd("dropspot");
                        dfd.resolve();
                        done();
                    });

                    it('should add dropspot', function (done) {
                        designer.dropspots([]);

                        designer.addDropspot();

                        dfd.promise.then(function () {
                            expect(designer.dropspots().length).toEqual(1);
                            done();
                        });
                    });

                    it('should clear dropspotToAdd', function (done) {
                        designer.addDropspot();

                        dfd.promise.then(function () {
                            expect(dropspotToAdd.clear).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should hide dropspotToAdd', function (done) {
                        designer.addDropspot();

                        dfd.promise.then(function () {
                            expect(dropspotToAdd.hide).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should notify user that everything was saved', function (done) {
                        designer.addDropspot();

                        dfd.promise.then(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });
            });



        });

        describe('removeDropspot:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(removeDropspotCommand, 'execute').and.returnValue(dfd.promise);
                spyOn(notify, 'saved');
            });

            it('should be function', function () {
                expect(designer.removeDropspot).toBeFunction();
            });

            it('should execute command to remove dropspot', function () {
                designer.removeDropspot();
                expect(removeDropspotCommand.execute).toHaveBeenCalled();
            });

            describe('when remove dropspot command is executed', function () {

                beforeEach(function (done) {
                    dfd.resolve();
                    done();
                });

                it('should remove dropspot', function (done) {
                    var dropspot = {};
                    designer.dropspots([dropspot]);
                    designer.removeDropspot(dropspot);

                    dfd.promise.then(function () {
                        expect(designer.dropspots().length).toEqual(0);
                        done();
                    });
                });

                it('should notify user that everything was saved', function (done) {
                    var dropspot = {};
                    designer.dropspots([dropspot]);
                    designer.removeDropspot(dropspot);

                    dfd.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });

        });

    });

});