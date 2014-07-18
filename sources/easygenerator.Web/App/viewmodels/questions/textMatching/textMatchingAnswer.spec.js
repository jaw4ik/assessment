define(['viewmodels/questions/textMatching/textMatchingAnswer'], function (TextMatchingAnswer) {

    var
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        changeAnswerKeyCommand = require('viewmodels/questions/textMatching/commands/changeAnswerKey'),
        changeAnswerValueCommand = require('viewmodels/questions/textMatching/commands/changeAnswerValue')
    ;

    describe('textMatchingAnswer:', function () {

        it('should be constructor function', function () {
            expect(TextMatchingAnswer).toBeFunction();
            expect(new TextMatchingAnswer()).toBeObject();
        });

        describe('when create an instance of textMatchingAnswer', function () {

            describe('id:', function () {

                it('should be defined', function () {
                    var answer = new TextMatchingAnswer('id');
                    expect(answer.id).toBeDefined();
                    expect(answer.id).toEqual('id');
                });

            });

            describe('key:', function () {
                var answer;

                beforeEach(function() {
                    answer = new TextMatchingAnswer('id', 'key', 'value');
                });

                it('shoould be observable', function () {
                    expect(answer.key).toBeObservable();
                    expect(answer.key()).toEqual('key');
                });

                describe('isEditing:', function () {
                    it('should be observable', function () {
                        expect(answer.key.isEditing).toBeObservable();
                    });
                });

                describe('endEditText:', function () {
                    var dfd;

                    beforeEach(function () {
                        dfd = Q.defer();
                        spyOn(changeAnswerKeyCommand, 'execute').and.returnValue(dfd.promise);
                        spyOn(notify, 'saved');
                        spyOn(eventTracker, 'publish');
                    });

                    it('should be function', function () {
                        expect(answer.key.endEditText).toBeFunction();
                    });

                    it('should trim answer key', function () {
                        answer.key('key        ');
                        answer.key.endEditText();
                        expect(answer.key()).toEqual('key');
                    });

                    it('should set isEditing to false', function () {
                        answer.key.isEditing(true);
                        answer.key.endEditText();
                        expect(answer.key.isEditing()).toBeFalsy();
                    });

                    describe('when current key is empty', function () {

                        it('should restore previous key', function () {
                            answer.key('');
                            answer.key.endEditText();
                            expect(answer.key()).toEqual('key');
                        });

                        it('should not execute command to change answer key', function () {
                            answer.key('');
                            answer.key.endEditText();
                            expect(changeAnswerKeyCommand.execute).not.toHaveBeenCalled();
                        });

                    });

                    describe('when current key was not modified', function () {

                        it('should not execute command to change answer key', function () {
                            answer.key.endEditText();
                            expect(changeAnswerKeyCommand.execute).not.toHaveBeenCalled();
                        });

                    });

                    it('should execute command to change answer key', function () {
                        answer.key('key!');
                        answer.key.endEditText();
                        expect(changeAnswerKeyCommand.execute).toHaveBeenCalled();
                    });

                    describe('when command to change answer key is executed', function () {

                        beforeEach(function () {
                            dfd.resolve();
                        });

                        it('should notify user that everything was saved', function (done) {
                            answer.key('key!');
                            answer.key.endEditText();

                            dfd.promise.then(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should track event \'Change answer key\'', function (done) {
                            answer.key('key!');
                            answer.key.endEditText();

                            dfd.promise.then(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer key');
                                done();
                            });
                        });

                    });

                });

                describe('beginEditText:', function () {
                    
                    it('should be function', function () {
                        expect(answer.key.beginEditText).toBeFunction();
                    });

                    it('should set isEditing to true', function () {
                        answer.key.isEditing(false);
                        answer.key.beginEditText();
                        expect(answer.key.isEditing).toBeTruthy();
                    });
                });

                describe('changeOriginalKey:', function () {
                    
                    it('should be function:', function () {
                        expect(answer.changeOriginalKey).toBeFunction();
                    });
                });
            });

            describe('value:', function () {
                var answer;

                beforeEach(function () {
                    answer = new TextMatchingAnswer('id', 'key', 'value');
                });

                it('shoould be observable', function () {
                    expect(answer.value).toBeObservable();
                    expect(answer.value()).toEqual('value');
                });

                describe('isEditing:', function () {
                    it('should be observable', function () {
                        expect(answer.value.isEditing).toBeObservable();
                    });
                });

                describe('endEditText:', function () {
                    var dfd;

                    beforeEach(function () {
                        dfd = Q.defer();
                        spyOn(changeAnswerValueCommand, 'execute').and.returnValue(dfd.promise);
                        spyOn(notify, 'saved');
                        spyOn(eventTracker, 'publish');
                    });

                    it('should be function', function () {
                        expect(answer.value.endEditText).toBeFunction();
                    });

                    it('should trim answer value', function () {
                        answer.value('value              ');
                        answer.value.endEditText();
                        expect(answer.value()).toEqual('value');
                    });

                    it('should set isEditing to false', function () {
                        answer.value.isEditing(true);
                        answer.value.endEditText();
                        expect(answer.value.isEditing()).toBeFalsy();
                    });

                    describe('when current value is empty', function () {

                        it('should restore previous value', function () {
                            answer.value('');
                            answer.value.endEditText();
                            expect(answer.value()).toEqual('value');
                        });

                        it('should not execute command to change answer value', function () {
                            answer.value('');
                            answer.value.endEditText();
                            expect(changeAnswerValueCommand.execute).not.toHaveBeenCalled();
                        });

                    });

                    describe('when current value was not modified', function () {

                        it('should not execute command to change answer value', function () {
                            answer.value.endEditText();
                            expect(changeAnswerValueCommand.execute).not.toHaveBeenCalled();
                        });

                    });

                    it('should execute command to change answer value', function () {
                        answer.value('value!');
                        answer.value.endEditText();
                        expect(changeAnswerValueCommand.execute).toHaveBeenCalled();
                    });

                    describe('when command to change answer value is executed', function () {

                        beforeEach(function () {
                            dfd.resolve();
                        });

                        it('should notify user that everything was saved', function (done) {
                            answer.value('value!');
                            answer.value.endEditText();

                            dfd.promise.then(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should track event \'Change answer value\'', function (done) {
                            answer.value('value!');
                            answer.value.endEditText();

                            dfd.promise.then(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer value');
                                done();
                            });
                        });

                    });

                });

                describe('beginEditText:', function () {

                    it('should be function', function () {
                        expect(answer.value.beginEditText).toBeFunction();
                    });

                    it('should set isEditing to true', function () {
                        answer.value.isEditing(false);
                        answer.value.beginEditText();
                        expect(answer.value.isEditing).toBeTruthy();
                    });
                });

                describe('changeOriginalValue:', function () {

                    it('should be function:', function () {
                        expect(answer.changeOriginalValue).toBeFunction();
                    });
                });
            });
        });
    });
})