﻿define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/fillInTheBlank/fibControl'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        system = require('durandal/system'),
        parser = require('utils/fillInTheBlankParser');

    describe('viewModel [fill in the blank]', function () {

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
                viewModel = ctor(null);
                expect(viewModel.text).toBeObservable();
            });

            describe('when content is null', function () {
                it('should be null', function () {
                    viewModel = ctor(null);
                    expect(viewModel.text()).toBeNull();
                });
            });

            describe('when content is empty string', function () {
                it('should be null', function () {
                    viewModel = ctor('');
                    expect(viewModel.text()).toBeNull();
                });
            });

            describe('when content is string', function () {
                it('should be content', function () {
                    var content = 'text';
                    viewModel = ctor(content);
                    expect(viewModel.text()).toBe(content);
                });
            });
        });

        describe('originalText:', function () {

            it('should be observable', function () {
                viewModel = ctor(null);
                expect(viewModel.originalText).toBeObservable();
            });

            describe('when content is null', function () {
                it('should be equal to text', function () {
                    viewModel = ctor(null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });

            describe('when content is empty string', function () {
                it('should be equal to text', function () {
                    viewModel = ctor(null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });

            describe('when content is string', function () {
                it('should be equal to text', function () {
                    viewModel = ctor(null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });
        });

        describe('beginEditText:', function () {

            beforeEach(function () {
                viewModel = ctor(null, answers, events);
            });

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should send event \'Event \'Begin edit text\'\'', function () {
                viewModel.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith(events.beginEditText);
            });
        });

        describe('endEditText:', function () {

            beforeEach(function () {
                viewModel = ctor(null, answers, events);
            });

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'Event \'End edit text\'\'', function () {
                viewModel.endEditText();
                expect(eventTracker.publish).toHaveBeenCalledWith('Event \'End edit text\'');
            });

        });

        describe('addFillInTheBlank:', function () {
            beforeEach(function () {
                viewModel = ctor(null, answers, events);
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
                viewModel = ctor([]);
            });

            it('should be number', function () {
                expect(viewModel.autosaveInterval).toEqual(jasmine.any(Number));
            });

        });

        describe('isContentDefined:', function () {

            beforeEach(function () {
                viewModel = ctor(null);
            });

            it('should be computed', function () {
                expect(viewModel.isContentDefined).toBeComputed();
            });

            describe('when text is null', function () {

                it('should be false', function () {
                    viewModel.text(null);
                    expect(viewModel.isContentDefined()).toBeFalsy();
                });

            });

            describe('when text is not null', function () {

                it('should be true', function () {
                    viewModel.text('some text');
                    expect(viewModel.isContentDefined()).toBeTruthy();
                });

            });

        });

        describe('updateText:', function () {

            var updateTextDefer;

            beforeEach(function () {
                updateTextDefer = Q.defer();
                spyOn(repository, 'updateFillInTheBlank').and.returnValue(updateTextDefer.promise);
                viewModel = ctor(null, answers, events, true, repository.updateFillInTheBlank);
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when text is empty', function () {

                it('should set text to null', function () {
                    viewModel.text('');
                    viewModel.updateText();
                    expect(viewModel.text()).toBeNull();
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

    });

});