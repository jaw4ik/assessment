define(['viewmodels/questions/dragAndDrop/dropspot'], function (Dropspot) {

    var
        notify = require('notify'),
        changeDropspotTextCommand = require('viewmodels/questions/dragAndDrop/commands/changeDropspotText'),
        changeDropspotPositionCommand = require('viewmodels/questions/dragAndDrop/commands/changeDropspotPosition')
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

                describe('endEditText:', function () {

                    var dfd;

                    beforeEach(function () {
                        dfd = Q.defer();
                        spyOn(changeDropspotTextCommand, 'execute').and.returnValue(dfd.promise);
                        spyOn(notify, 'saved');
                    });

                    it('should be function', function () {
                        var dropspot = new Dropspot('id', 'dropspot');
                        expect(dropspot.text.endEditText).toBeFunction();
                    });

                    it('should execute command to change dropspot text', function () {
                        var dropspot = new Dropspot('id', 'dropspot');
                        dropspot.text.endEditText();
                        expect(changeDropspotTextCommand.execute).toHaveBeenCalled();
                    });

                    describe('when command to change dropspot text is executed', function () {

                        beforeEach(function () {
                            dfd.resolve();
                        });

                        it('should notify user that everything was saved', function (done) {
                            var dropspot = new Dropspot('id', 'dropspot');
                            dropspot.text.endEditText();

                            dfd.promise.then(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

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

                describe('endMoveDropspot:', function () {

                    var dfd;

                    beforeEach(function () {
                        dfd = Q.defer();
                        spyOn(changeDropspotPositionCommand, 'execute').and.returnValue(dfd.promise);
                    });

                    it('should be function', function () {
                        expect(dropspot.position.endMoveDropspot).toBeFunction();
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

                        it('should notify user that everything was saved', function (done) {
                            dropspot.position.endMoveDropspot();
                            dfd.promise.then(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

            });
        });



    });

})