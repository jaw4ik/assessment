define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/fillInTheBlank/fibControl'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        system = require('durandal/system'),
        parser = require('./fillInTheBlankParser');

    describe('viewModel [fibControl]', function () {

        var viewModel,
            events = {
                addFillInTheBlank: 'Event \'Add fill in the blank\'',
                beginEditText: 'Event \'Begin edit text\'',
                endEditText: 'Event \'End edit text\''
            },
            repository = {
                updateFillInTheBlank: function () {
                    return Q.fcall(function () { });
                }
            },
            answers = [
                {
                    id: 'someid1',
                    text: 'text1',
                    groupId: "gropId1"
                }, {
                    id: 'someid2',
                    text: 'text2',
                    groupId: "gropId1"
                }
            ];

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
            spyOn(system, 'guid').and.returnValue('gropId1');
        });

        describe('text:', function () {

            it('should be observable', function () {
                viewModel = new ctor(null);
                expect(viewModel.text).toBeObservable();
            });

            describe('when content is null', function () {
                it('should be empty', function () {
                    viewModel = new ctor(null);
                    expect(viewModel.text()).toBe('');
                });
            });

            describe('when content is empty string', function () {
                it('should be null', function () {
                    viewModel = new ctor('');
                    expect(viewModel.text()).toBe('');
                });
            });

            describe('when content is string', function () {
                it('should be content', function () {
                    var content = 'text';
                    viewModel = new ctor(content);
                    expect(viewModel.text()).toBe(content);
                });
            });
        });

        describe('originalText:', function () {

            it('should be observable', function () {
                viewModel = new ctor(null);
                expect(viewModel.originalText).toBeObservable();
            });

            describe('when content is null', function () {
                it('should be equal to text', function () {
                    viewModel = new ctor(null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });

            describe('when content is empty string', function () {
                it('should be equal to text', function () {
                    viewModel = new ctor(null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });

            describe('when content is string', function () {
                it('should be equal to text', function () {
                    viewModel = new ctor(null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });
        });

        describe('beginEditText:', function () {

            beforeEach(function () {
                viewModel = new ctor(null, answers, events);
            });

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should send event \'Event \'Begin edit text\'\'', function () {
                viewModel.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith(events.beginEditText);
            });

            it('should set isEditing to true', function () {
                viewModel.isEditing(false);
                viewModel.beginEditText({});
                expect(viewModel.isEditing()).toBeTruthy();
            });
        });

        describe('endEditText:', function () {

            beforeEach(function () {
                viewModel = new ctor(null, answers, events);
            });

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'Event \'End edit text\'\'', function () {
                viewModel.endEditText();
                expect(eventTracker.publish).toHaveBeenCalledWith('Event \'End edit text\'');
            });

            it('should set isEditing to false', function () {
                viewModel.isEditing(true);
                viewModel.endEditText();
                expect(viewModel.isEditing()).toBeFalsy();
            });

        });

        describe('addFillInTheBlank:', function () {
            beforeEach(function () {
                viewModel = new ctor(null, answers, events);
            });

            it('should be function', function () {
                expect(viewModel.addFillInTheBlank).toBeFunction();
            });

            it('should send event \'Event \'Add fill in the blan\'\'', function () {
                viewModel.addFillInTheBlank();
                expect(eventTracker.publish).toHaveBeenCalledWith('Event \'Add fill in the blank\'');
            });

            it('should set text to empty string', function () {
                viewModel.addFillInTheBlank();
                expect(viewModel.text()).toBe('');
            });

            it('should set hasFocus to true', function () {
                viewModel.hasFocus(false);
                viewModel.addFillInTheBlank();
                expect(viewModel.hasFocus()).toBe(true);
            });
        });

        describe('autosaveInterval:', function () {

            beforeEach(function () {
                viewModel = new ctor([]);
            });

            it('should be number', function () {
                expect(viewModel.autosaveInterval).toEqual(jasmine.any(Number));
            });

        });

        describe('isEmpty:', function () {

            beforeEach(function () {
                viewModel = new ctor(null);
            });

            it('should be computed', function () {
                expect(viewModel.isEmpty).toBeComputed();
            });

            describe('when text is empty html', function () {

                describe('and when element has no focus', function () {

                    it('should be true', function () {
                        viewModel.text('');
                        viewModel.hasFocus(false);
                        expect(viewModel.isEmpty()).toBeTruthy();
                    });

                });

                describe('and when element has focus', function () {

                    it('should be true', function () {
                        viewModel.text('');
                        viewModel.hasFocus(true);
                        expect(viewModel.isEmpty()).toBeFalsy();
                    });

                });

            });

            describe('when text is not null', function () {

                it('should be false', function () {
                    viewModel.text('some text');
                    expect(viewModel.isEmpty()).toBeFalsy();
                });

            });

        });

        describe('updateText:', function () {

            var updateTextDefer;

            beforeEach(function () {
                updateTextDefer = Q.defer();
                spyOn(repository, 'updateFillInTheBlank').and.returnValue(updateTextDefer.promise);
                viewModel = new ctor(null, answers, events, true, repository.updateFillInTheBlank);
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when text is empty html', function () {

                it('should set text to empty', function () {
                    viewModel.text('');
                    viewModel.updateText();
                    expect(viewModel.text()).toBe('');
                });

            });

            describe('when current text equal previous text', function () {

                it('should not be promise', function () {
                    viewModel.text('some text');
                    viewModel.originalText('some text');
                    expect(viewModel.updateText()).toBeUndefined();
                });

            });

            describe('when current text is not equal previous text', function () {

                beforeEach(function () {
                    viewModel.text('some new text');
                    viewModel.originalText('some old text');
                });

                it('should return promise', function () {
                    expect(viewModel.updateText()).toBePromise();
                });

                it('should be call update fillInTheBlank function', function () {
                    viewModel.updateText();
                    expect(repository.updateFillInTheBlank).toHaveBeenCalledWith(viewModel.text(), []);
                });

                describe('and when content is updated', function () {

                    beforeEach(function () {
                        updateTextDefer.resolve();
                    });

                    it('should update previous text to current text', function (done) {
                        viewModel.updateText().fin(function () {
                            expect(viewModel.originalText()).toBe(viewModel.text());
                            done();
                        });
                    });

                    it('should show notification', function (done) {
                        viewModel.updateText().fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

        });

        describe('isEditing:', function () {
            it('should be observable', function() {
                expect(viewModel.isEditing).toBeObservable();
            });
        });

        describe('updatedByCollaborator:', function () {
            var question,
                fillInTheBlank = 'some content';

            beforeEach(function () {
                spyOn(parser, 'getData').and.returnValue(fillInTheBlank);
            });

            it('should be function:', function () {
                expect(viewModel.updatedByCollaborator).toBeFunction();
            });

            describe('when question content is null', function() {

                it('should set null to empty string', function () {
                    viewModel.text('some text');
                    viewModel.updatedByCollaborator({});
                    expect(viewModel.text()).toBe('');
                });

                it('should set empty string to original text', function () {
                    viewModel.originalText('some text');
                    viewModel.updatedByCollaborator({});
                    expect(viewModel.text()).toBe('');
                });
            });

            describe('when isEditing is true', function() {
                
                beforeEach(function () {
                    question = { content: 'text' };
                    viewModel.isEditing(true);
                });

                it('should update original text', function () {
                    viewModel.originalText('');
                    viewModel.updatedByCollaborator(question);
                    expect(viewModel.originalText()).toBe(fillInTheBlank);
                });

                it('should not update text', function () {
                    viewModel.text('');
                    viewModel.updatedByCollaborator(question);
                    expect(viewModel.text()).toBe('');
                });
            });

            describe('when isEditing is false', function () {
                beforeEach(function () {
                    question = { content: 'text' };
                    viewModel.isEditing(false);
                });

                it('should update original text', function () {
                    viewModel.originalText('');
                    viewModel.updatedByCollaborator(question);
                    expect(viewModel.originalText()).toBe(fillInTheBlank);
                });

                it('should update text', function() {
                    viewModel.text('');
                    viewModel.updatedByCollaborator(question);
                    expect(viewModel.text()).toBe(fillInTheBlank);
                });
            });
        });
    });

});