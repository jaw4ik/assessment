define(['viewmodels/questions/dragAndDropText/dropspot'], function (Dropspot) {

    var
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        changeDropspotTextCommand = require('viewmodels/questions/dragAndDropText/commands/changeDropspotText'),
        changeDropspotPositionCommand = require('viewmodels/questions/dragAndDropText/commands/changeDropspotPosition')
    ;

    describe('dropspot:', function () {

        it('should be constructor function', function () {
            expect(Dropspot).toBeFunction();
            expect(new Dropspot()).toBeObject();
        });

        describe('when create an instance of dropspot', function () {

            describe('id:', function () {

                it('should be defined', function () {
                    var dropspot = new Dropspot('id');
                    expect(dropspot.id).toBeDefined();
                    expect(dropspot.id).toEqual('id');
                });

            });

            describe('text:', function () {

                it('shoould be observable', function () {
                    var dropspot = new Dropspot('id', 'dropspot');
                    expect(dropspot.text).toBeObservable();
                    expect(dropspot.text()).toEqual('dropspot');
                });

                describe('isEditing:', function() {
                    var dropspot = new Dropspot('id', 'dropspot');

                    it('should be observable', function () {
                        expect(dropspot.text.isEditing).toBeObservable();
                    });
                });

                describe('endEditText:', function () {

                    var dfd;

                    beforeEach(function () {
                        dfd = Q.defer();
                        spyOn(changeDropspotTextCommand, 'execute').and.returnValue(dfd.promise);
                        spyOn(notify, 'saved');
                        spyOn(eventTracker, 'publish');
                    });

                    it('should be function', function () {
                        var dropspot = new Dropspot('id', 'dropspot');
                        expect(dropspot.text.endEditText).toBeFunction();
                    });

                    it('should trim dropspot text', function () {
                        var dropspot = new Dropspot('id', '     dropspot     ');
                        dropspot.text.endEditText();
                        expect(dropspot.text()).toEqual('dropspot');
                    });

                    it('should set isEditing to false', function() {
                        var dropspot = new Dropspot('id', 'dropspot');
                        dropspot.text.isEditing(true);
                        dropspot.text.endEditText();
                        expect(dropspot.text.isEditing()).toBeFalsy();
                    });

                    describe('when current text is empty', function () {

                        it('should restore previous text', function () {
                            var dropspot = new Dropspot('id', 'dropspot');
                            dropspot.text('');
                            dropspot.text.endEditText();
                            expect(dropspot.text()).toEqual('dropspot');
                        });

                        it('should not execute command to change dropspot text', function () {
                            var dropspot = new Dropspot('id', 'dropspot');
                            dropspot.text('');
                            dropspot.text.endEditText();
                            expect(changeDropspotTextCommand.execute).not.toHaveBeenCalled();
                        });

                    });

                    describe('when current text was not modified', function () {

                        it('should not execute command to change dropspot text', function () {
                            var dropspot = new Dropspot('id', 'dropspot');
                            dropspot.text.endEditText();
                            expect(changeDropspotTextCommand.execute).not.toHaveBeenCalled();
                        });

                    });

                    it('should execute command to change dropspot text', function () {
                        var dropspot = new Dropspot('id', 'dropspot');
                        dropspot.text('dropspot!');
                        dropspot.text.endEditText();
                        expect(changeDropspotTextCommand.execute).toHaveBeenCalled();
                    });

                    describe('when command to change dropspot text is executed', function () {

                        beforeEach(function () {
                            dfd.resolve();
                        });

                        it('should notify user that everything was saved', function (done) {
                            var dropspot = new Dropspot('id', 'dropspot');
                            dropspot.text('dropspot!');
                            dropspot.text.endEditText();

                            dfd.promise.then(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should track event \'Change dropspot text\'', function (done) {
                            var dropspot = new Dropspot('id', 'dropspot');
                            dropspot.text('dropspot!');
                            dropspot.text.endEditText();

                            dfd.promise.then(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change dropspot text');
                                done();
                            });
                        });

                    });

                });

                describe('beginEditText:', function () {
                    var dropspot = new Dropspot('id', 'dropspot');

                    it('should be function', function () {
                        expect(dropspot.text.beginEditText).toBeFunction();
                    });

                    it('should set isEditing to true', function() {
                        dropspot.text.isEditing(false);
                        dropspot.text.beginEditText();
                        expect(dropspot.text.isEditing).toBeTruthy();
                    });
                });

                describe('changeOriginalText:', function () {
                    var dropspot = new Dropspot('id', 'dropspot');

                    it('should be function:', function () {
                        expect(dropspot.changeOriginalText).toBeFunction();
                    });
                });
            });

            describe('position:', function () {

                var dropspot;

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                });

                it('should be object', function () {
                    expect(dropspot.position).toBeObject();
                });

                describe('x:', function () {

                    it('should be observable', function () {
                        expect(dropspot.position.x).toBeObservable();
                        expect(dropspot.position.x()).toEqual(10);
                    });

                });

                describe('y:', function () {

                    it('should be observable', function () {
                        expect(dropspot.position.y).toBeObservable();
                        expect(dropspot.position.y()).toEqual(20);
                    });

                });

                describe('isMoving:', function () {
                    it('should be observable', function () {
                        expect(dropspot.position.isMoving).toBeObservable();
                    });
                });

                describe('startMoveDropspot:', function () {
                    it('should be function', function() {
                        expect(dropspot.position.startMoveDropspot).toBeFunction();
                    });

                    it('should set isMoving to true', function() {
                        dropspot.position.isMoving(false);
                        dropspot.position.startMoveDropspot();
                        expect(dropspot.position.isMoving()).toBeTruthy();
                    });
                });

                describe('endMoveDropspot:', function () {

                    var dfd;

                    beforeEach(function () {
                        dfd = Q.defer();
                        spyOn(changeDropspotPositionCommand, 'execute').and.returnValue(dfd.promise);
                        spyOn(eventTracker, 'publish');
                    });

                    it('should be function', function () {
                        expect(dropspot.position.endMoveDropspot).toBeFunction();
                    });

                    it('should set isMoving to false', function () {
                        dropspot.position.isMoving(true);
                        dropspot.position.endMoveDropspot();
                        expect(dropspot.position.isMoving()).toBeFalsy();
                    });

                    it('should execute command to change dropspot position', function () {
                        dropspot.position.endMoveDropspot();
                        expect(changeDropspotPositionCommand.execute).toHaveBeenCalled();
                    });

                    describe('and change dropspot position command is excuted', function () {

                        beforeEach(function () {
                            spyOn(notify, 'saved');
                            dfd.resolve();
                        });

                        it('should change dropspot position', function (done) {
                            dropspot.position.endMoveDropspot(100, 200);
                            dfd.promise.then(function () {
                                expect(dropspot.position.x()).toEqual(100);
                                expect(dropspot.position.y()).toEqual(200);
                                done();
                            });
                        });

                        it('should notify user that everything was saved', function (done) {
                            dropspot.position.endMoveDropspot();
                            dfd.promise.then(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should track event \'Change dropspot position\'', function (done) {
                            dropspot.position.endMoveDropspot();

                            dfd.promise.then(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change dropspot position');
                                done();
                            });
                        });
                    });
                });

            });

            describe('size:', function () {

                var dropspot;

                beforeEach(function () {
                    dropspot = new Dropspot('id', 'dropspot', 10, 20);
                });

                it('should be object', function () {
                    expect(dropspot.size).toBeObject();
                });

                describe('width:', function () {

                    it('should be observable', function () {
                        expect(dropspot.size.width).toBeObservable();
                    });

                });

                describe('height:', function () {

                    it('should be observable', function () {
                        expect(dropspot.size.height).toBeObservable();
                    });

                });

            });

        });

    });

})