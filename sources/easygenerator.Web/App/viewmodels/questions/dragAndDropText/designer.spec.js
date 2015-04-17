define(['viewmodels/questions/dragAndDropText/designer'], function (designer) {

    var
        eventTracker = require('eventTracker'),
        imageUpload = require('imageUpload'),
        notify = require('notify'),
        uiLocker = require('uiLocker'),
        Dropspot = require('viewmodels/questions/dragAndDropText/dropspot'),
        dropspotToAdd = require('viewmodels/questions/dragAndDropText/dropspotToAdd'),
        changeBackgroundCommand = require('viewmodels/questions/dragAndDropText/commands/changeBackground'),
        addDropspotCommand = require('viewmodels/questions/dragAndDropText/commands/addDropspot'),
        removeDropspotCommand = require('viewmodels/questions/dragAndDropText/commands/removeDropspot'),

        getQuestionContentByIdQuery = require('viewmodels/questions/dragAndDropText/queries/getQuestionContentById')
    ;

    describe('viewmodel [designer]', function () {

        it('should be object', function () {
            expect(designer).toBeObject();
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

            describe('isLoading:', function () {
                it('should be observable', function () {
                    expect(designer.background.isLoading).toBeObservable();
                });
            });

            describe('onload:', function () {

                var width = 10;
                var height = 100;

                it('should be function', function () {
                    expect(designer.background.onload).toBeFunction();
                });

                it('should set isLoading to false', function () {
                    designer.background.isLoading(true);
                    designer.background.onload(width, height);

                    expect(designer.background.isLoading()).toBeFalsy();
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

                describe('when dropspots are present', function () {

                    var dropspot = new Dropspot('id', 'text', 0, 0);

                    beforeEach(function () {
                        designer.dropspots([dropspot]);
                        spyOn(dropspot.position, 'endMoveDropspot');
                    });


                    describe('and when dropspot left position is out of background area', function () {

                        it('should move it to the top left corner', function () {
                            dropspot.position.x(100);
                            dropspot.position.y(5);
                            dropspot.size.width(5);
                            dropspot.size.height(5);

                            designer.background.onload(50, 50);

                            expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                        });

                    });

                    describe('and when dropspot top position is out of background area', function () {

                        it('should move it to top left corner', function () {
                            dropspot.position.x(5);
                            dropspot.position.y(100);
                            dropspot.size.width(5);
                            dropspot.size.height(5);

                            designer.background.onload(50, 50);

                            expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                        });

                    });

                    describe('and when dropspot right position is out of background area', function () {

                        it('should move it to the top left corner', function () {
                            dropspot.position.x(5);
                            dropspot.position.y(5);
                            dropspot.size.width(100);
                            dropspot.size.height(5);

                            designer.background.onload(50, 50);

                            expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                        });

                    });

                    describe('and when dropspot bottom position is out of background area', function () {

                        it('should move it to the top left corner', function () {
                            dropspot.position.x(5);
                            dropspot.position.y(5);
                            dropspot.size.width(5);
                            dropspot.size.height(100);

                            designer.background.onload(50, 50);

                            expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                        });

                    });

                    describe('and when dropspot is within the background area', function () {

                        it('should not change position', function () {
                            dropspot.position.x(5);
                            dropspot.position.y(5);
                            dropspot.size.width(5);
                            dropspot.size.height(5);

                            designer.background.onload(50, 50);

                            expect(dropspot.position.endMoveDropspot).not.toHaveBeenCalled();
                        });

                    });

                });

                describe('when dropspots are not present and when background is dirty', function () {

                    beforeEach(function () {
                        designer.dropspots([]);
                        designer.background.isDirty(true);
                        spyOn(designer.dropspotToAdd, 'show');
                    });

                    it('should show dropspotToAdd', function () {
                        designer.background.onload(width, height);

                        expect(designer.dropspotToAdd.show).toHaveBeenCalled();
                    });

                });

            });

        });

        describe('uploadBackground:', function () {

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

            describe('when image loading is started', function () {

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

            describe('when image upload was successful', function () {

                var url = 'http://xxx.com', urlParams = '?width=939&height=785', dfd, questionId = null;

                beforeEach(function () {
                    spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                        spec.success(url);
                    });

                    dfd = Q.defer();
                    spyOn(changeBackgroundCommand, 'execute').and.returnValue(dfd.promise);

                    spyOn(notify, 'saved');
                    spyOn(eventTracker, 'publish');
                });


                it('should execute command to change background', function () {
                    designer.background(undefined);
                    designer.uploadBackground();
                    expect(changeBackgroundCommand.execute).toHaveBeenCalledWith(questionId, url + urlParams);
                });

                describe('and command to change background was executed', function () {

                    beforeEach(function () {
                        dfd.resolve();
                    });

                    it('should set background isLoading to true', function () {
                        designer.background.isLoading(false);
                        designer.uploadBackground();
                        expect(designer.background.isLoading()).toBeTruthy();
                    });

                    it('should update background url', function () {
                        designer.background(undefined);
                        designer.uploadBackground();
                        expect(designer.background()).toEqual(url + urlParams);
                    });

                    it('should notify user that everything was saved', function () {
                        designer.uploadBackground();
                        expect(notify.saved).toHaveBeenCalled();
                    });

                    it('should track event \'Change drag and drop background\'', function () {
                        designer.uploadBackground();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Change drag and drop background');
                    });

                });

            });

            describe('when image upload is complete', function () {

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
                spyOn(eventTracker, 'publish');
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
                    spyOn(dropspotToAdd, 'trim').and.returnValue(true);
                });

                it('should trim dropspotToAdd', function () {
                    designer.dropspotToAdd("dropspot");
                    designer.addDropspot();
                    expect(addDropspotCommand.execute).toHaveBeenCalled();
                });

                it('should execute command to add dropspot', function () {
                    designer.dropspotToAdd("  dropspot  ");
                    designer.addDropspot();
                    expect(dropspotToAdd.trim).toHaveBeenCalled();
                });

                describe('and add dropspot command is executed', function () {

                    beforeEach(function (done) {
                        spyOn(dropspotToAdd, 'clear');
                        spyOn(dropspotToAdd, 'hide');
                        designer.dropspotToAdd("dropspot");
                        dfd.resolve('id');
                        done();
                    });

                    it('should add dropspot', function (done) {
                        designer.dropspots([]);

                        designer.addDropspot();

                        dfd.promise.then(function () {
                            expect(designer.dropspots().length).toEqual(1);
                            expect(designer.dropspots()[0].id).toEqual('id');
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

                    it('should track event \'Create dropspot\'', function (done) {
                        designer.addDropspot();

                        dfd.promise.then(function () {
                            expect(eventTracker.publish).toHaveBeenCalledWith('Create dropspot');
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
                spyOn(eventTracker, 'publish');
            });

            it('should be function', function () {
                expect(designer.removeDropspot).toBeFunction();
            });

            it('should execute command to remove dropspot', function () {
                designer.removeDropspot({ id: 'id' });
                expect(removeDropspotCommand.execute).toHaveBeenCalled();
            });

            describe('when remove dropspot command is executed', function () {

                beforeEach(function (done) {
                    dfd.resolve();
                    done();
                });

                it('should remove dropspot', function (done) {
                    var dropspot = { id: 'id' };
                    designer.dropspots([dropspot]);
                    designer.removeDropspot(dropspot);

                    dfd.promise.then(function () {
                        expect(designer.dropspots().length).toEqual(0);
                        done();
                    });
                });

                it('should notify user that everything was saved', function (done) {
                    var dropspot = { id: 'id' };
                    designer.dropspots([dropspot]);
                    designer.removeDropspot(dropspot);

                    dfd.promise.then(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                it('should track event \'Delete dropspot\'', function (done) {
                    var dropspot = { id: 'id' };
                    designer.dropspots([dropspot]);
                    designer.removeDropspot(dropspot);

                    dfd.promise.then(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Delete dropspot');
                        done();
                    });
                });

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

            describe('when drag and drop content does not exist', function () {

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

                it('should set an empty dropspots collection', function (done) {
                    designer.dropspots([{}, {}, {}]);
                    designer.activate().then(function () {
                        expect(designer.dropspots().length).toEqual(0);
                        done();
                    });
                });

            });

            describe('when drag and drop content exists', function () {

                it('should set background isLoading to true', function (done) {
                    designer.background.isLoading(false);
                    dfd.resolve({ background: 'background' });

                    designer.activate().then(function () {
                        expect(designer.background.isLoading()).toBeTruthy();
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

                it('should set dropspots collection', function (done) {
                    designer.dropspots([]);
                    dfd.resolve({ dropspots: [{}, {}] });

                    designer.activate().then(function () {
                        expect(designer.dropspots().length).toEqual(2);
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

        describe('dropspotEndEdit:', function () {

            it('should be function', function () {
                expect(designer.dropspotEndEdit).toBeFunction();
            });

            describe('when dropspot is marked as deleted', function () {

                it('should delete dropspot from list', function () {
                    var dropspot = new Dropspot('id', 'text', 0, 0);
                    dropspot.isDeleted = true;
                    designer.dropspots([dropspot]);
                    designer.dropspotEndEdit(dropspot);
                    expect(designer.dropspots().length).toBe(0);
                });

            });

            describe('when dropspot is not marked as deleted', function () {

                it('should not delete dropspot from list', function () {
                    var dropspot = new Dropspot('id', 'text', 0, 0);
                    designer.dropspots([dropspot]);
                    designer.dropspotEndEdit(dropspot);
                    expect(designer.dropspots().length).toBe(1);
                });

            });

            describe('when dropspot left position is out of background area', function () {

                it('should move it to the top left corner', function () {
                    var dropspot = new Dropspot('id', 'text', 100, 5);
                    spyOn(dropspot.position, 'endMoveDropspot');

                    dropspot.size.width(5);
                    dropspot.size.height(5);

                    designer.background.width(50);
                    designer.background.height(50);

                    designer.dropspotEndEdit(dropspot);

                    expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                });

            });

            describe('when dropspot top position is out of background area', function () {

                it('should move it to top left corner', function () {
                    var dropspot = new Dropspot('id', 'text', 5, 100);
                    spyOn(dropspot.position, 'endMoveDropspot');

                    dropspot.size.width(5);
                    dropspot.size.height(5);

                    designer.background.width(50);
                    designer.background.height(50);

                    designer.dropspotEndEdit(dropspot);

                    expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                });

            });

            describe('when dropspot right position is out of background area', function () {

                it('should move it to the top left corner', function () {
                    var dropspot = new Dropspot('id', 'text', 5, 5);
                    spyOn(dropspot.position, 'endMoveDropspot');

                    dropspot.size.width(100);
                    dropspot.size.height(5);

                    designer.background.width(50);
                    designer.background.height(50);

                    designer.dropspotEndEdit(dropspot);

                    expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                });

            });

            describe('when dropspot bottom position is out of background area', function () {

                it('should move it to the top left corner', function () {
                    var dropspot = new Dropspot('id', 'text', 5, 5);
                    spyOn(dropspot.position, 'endMoveDropspot');

                    dropspot.size.width(5);
                    dropspot.size.height(100);

                    designer.background.width(50);
                    designer.background.height(50);

                    designer.dropspotEndEdit(dropspot);

                    expect(dropspot.position.endMoveDropspot).toHaveBeenCalledWith(0, 0);
                });

            });

            describe('when dropspot is within the background area', function () {

                it('should not change position', function () {
                    var dropspot = new Dropspot('id', 'text', 5, 5);
                    spyOn(dropspot.position, 'endMoveDropspot');

                    dropspot.size.width(5);
                    dropspot.size.height(5);

                    designer.background.width(50);
                    designer.background.height(50);

                    designer.dropspotEndEdit(dropspot);

                    expect(dropspot.position.endMoveDropspot).not.toHaveBeenCalled();
                });

            });
        });
    });

});