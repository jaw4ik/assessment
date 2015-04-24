define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/common/contentField'),
        eventTracker = require('eventTracker'),
        notify = require('notify');

    describe('viewModel [entityContent]', function () {

        var viewModel,
            events = {
                addContent: 'Event \'Add content\'',
                beginEditText: 'Event \'Begin edit text\'',
                endEditText: 'Event \'End edit text\''
            },
            repository = {
                updateContent: function () {
                    return Q.fcall(function () { });
                }
            };

        beforeEach(function () {
            spyOn(notify, 'saved');
            spyOn(eventTracker, 'publish');
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

        describe('isEditing:', function () {

            beforeEach(function () {
                viewModel = ctor(null, events);
            });

            it('should be observable', function() {
                expect(viewModel.isEditing).toBeObservable();
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
                viewModel = ctor(null, events);
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

            it('should set hasFocus to true', function () {
                viewModel.hasFocus(false);

                viewModel.beginEditText({});
                expect(viewModel.hasFocus()).toBeTruthy();
            });
        });

        describe('endEditText:', function () {

            beforeEach(function () {
                viewModel = ctor(null, events);
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

        describe('addContent:', function () {
            beforeEach(function () {
                viewModel = ctor(null, events);
            });

            it('should be function', function () {
                expect(viewModel.addContent).toBeFunction();
            });

            it('should send event \'Event \'Add content\'\'', function () {
                viewModel.addContent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Event \'Add content\'');
            });

            it('should set text to empty string', function () {
                viewModel.addContent();
                expect(viewModel.text()).toBe('');
            });

            it('should set isExpended to true', function () {
                viewModel.isExpanded(false);
                viewModel.addContent();
                expect(viewModel.isExpanded()).toBeTruthy();
            });

            it('should set hasFocus to true', function () {
                viewModel.hasFocus(false);
                viewModel.addContent();
                expect(viewModel.hasFocus()).toBe(true);
            });
        });

        describe('isExpanded:', function () {

            beforeEach(function () {
                viewModel = ctor([]);
            });

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

            describe('when contructor takes true', function () {

                beforeEach(function () {
                    viewModel = ctor([], events, true);
                });

                it('should be true', function () {
                    expect(viewModel.isExpanded()).toBeTruthy();
                });

            });

            describe('when contructor takes false', function () {

                beforeEach(function () {
                    viewModel = ctor([], events, false);
                });

                it('should be true by default', function () {
                    expect(viewModel.isExpanded()).toBeFalsy();
                });

            });

        });

        describe('toggleExpand:', function () {

            beforeEach(function () {
                viewModel = ctor([]);
            });

            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            it('should toggle isExpanded value', function () {
                viewModel.isExpanded(false);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toEqual(true);
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
                spyOn(repository, 'updateContent').and.returnValue(updateTextDefer.promise);
                viewModel = ctor(null, events, true, repository.updateContent);
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

                it('should be call update content function', function () {
                    viewModel.updateText();
                    expect(repository.updateContent).toHaveBeenCalledWith(viewModel.text());
                });

                describe('when content is updated', function () {

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