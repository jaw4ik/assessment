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
            expect(new TextMatchingAnswer('id', 'key', 'value')).toBeObject();
        });

        describe('when create an instance of textMatchingAnswer', function () {
            var answer;

            beforeEach(function () {
                answer = new TextMatchingAnswer('id', 'key', 'value');
            });

            describe('id:', function () {
                it('should be defined', function () {
                    expect(answer.id).toBeDefined();
                    expect(answer.id).toEqual('id');
                });

            });

            describe('key:', function () {
                
                it('shoould be observable', function () {
                    expect(answer.key).toBeObservable();
                    expect(answer.key()).toEqual('key');
                });

                describe('hasFocus:', function () {
                    it('should be observable', function () {
                        expect(answer.key.hasFocus).toBeObservable();
                    });

                    describe('when hasFocus parameter of construnctor is defined', function() {
                        it('should be set to hasFocus', function() {
                            answer = new TextMatchingAnswer('id', 'key', 'value', true);
                            expect(answer.key.hasFocus()).toBeTruthy();
                        });
                    });

                    describe('when hasFocus parameter of construnctor is not defined', function () {
                        it('should be set to false', function() {
                            answer = new TextMatchingAnswer('id', 'key', 'value');
                            expect(answer.key.hasFocus()).toBeFalsy();
                        });
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

                    it('should set hasFocus to false', function () {
                        answer.key.hasFocus(true);
                        answer.key.endEditText();
                        expect(answer.key.hasFocus()).toBeFalsy();
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

                        it('should track event \'Change answer key (text matching)\'', function (done) {
                            answer.key('key!');
                            answer.key.endEditText();

                            dfd.promise.then(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer key (text matching)');
                                done();
                            });
                        });

                    });

                });

                describe('beginEditText:', function () {
                    
                    it('should be function', function () {
                        expect(answer.key.beginEditText).toBeFunction();
                    });

                    it('should set hasFocus to true', function () {
                        answer.key.hasFocus(false);
                        answer.key.beginEditText();
                        expect(answer.key.hasFocus).toBeTruthy();
                    });
                });

                describe('isValid', function () {
                    it('should be computed', function() {
                        expect(answer.key.isValid).toBeComputed();
                    });

                    describe('when key is empty string', function() {
                        it('should return false', function () {
                            answer.key('');
                            expect(answer.key.isValid()).toBeFalsy();
                        });
                    });

                    describe('when key has 256 symbols', function() {
                        it('should return false', function () {
                            answer.key(utils.createString(256));
                            expect(answer.key.isValid()).toBeFalsy();
                        });
                    });
                });
            });

            describe('changeOriginalKey:', function () {

                it('should be function:', function () {
                    expect(answer.changeOriginalKey).toBeFunction();
                });
            });

            describe('value:', function () {
                it('shoould be observable', function () {
                    expect(answer.value).toBeObservable();
                    expect(answer.value()).toEqual('value');
                });

                describe('hasFocus:', function () {
                    it('should be observable', function () {
                        expect(answer.value.hasFocus).toBeObservable();
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

                    it('should set hasFocus to false', function () {
                        answer.value.hasFocus(true);
                        answer.value.endEditText();
                        expect(answer.value.hasFocus()).toBeFalsy();
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

                        it('should track event \'Change answer value (text matching)\'', function (done) {
                            answer.value('value!');
                            answer.value.endEditText();

                            dfd.promise.then(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer value (text matching)');
                                done();
                            });
                        });

                    });

                });

                describe('beginEditText:', function () {

                    it('should be function', function () {
                        expect(answer.value.beginEditText).toBeFunction();
                    });

                    it('should set hasFocus to true', function () {
                        answer.value.hasFocus(false);
                        answer.value.beginEditText();
                        expect(answer.value.hasFocus).toBeTruthy();
                    });
                });

                describe('isValid', function () {
                    it('should be computed', function () {
                        expect(answer.value.isValid).toBeComputed();
                    });

                    describe('when value is empty string', function () {
                        it('should return false', function () {
                            answer.value('');
                            expect(answer.value.isValid()).toBeFalsy();
                        });
                    });

                    describe('when value has 256 symbols', function () {
                        it('should return false', function () {
                            answer.value(utils.createString(256));
                            expect(answer.value.isValid()).toBeFalsy();
                        });
                    });
                });
            });

            describe('changeOriginalValue:', function () {

                it('should be function:', function () {
                    expect(answer.changeOriginalValue).toBeFunction();
                });
            });
        });
    });
})