define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/questions/questionContent'),
        repository = require('repositories/questionRepository'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [questionContent]', function () {

        var viewModel;
        var questionId = 'questionId';

        beforeEach(function () {
            spyOn(notify, 'info');
            spyOn(eventTracker, 'publish');
        });

        describe('text:', function () {

            it('should be observable', function () {
                viewModel = ctor(questionId, null);
                expect(viewModel.text).toBeObservable();
            });

            describe('when content is null', function () {
                it('should be null', function () {
                    viewModel = ctor(questionId, null);
                    expect(viewModel.text()).toBeNull();
                });
            });

            describe('when content is empty string', function () {
                it('should be null', function () {
                    viewModel = ctor(questionId, '');
                    expect(viewModel.text()).toBeNull();
                });
            });

            describe('when content is string', function () {
                it('should be content', function () {
                    var content = 'text';
                    viewModel = ctor(questionId, content);
                    expect(viewModel.text()).toBe(content);
                });
            });
        });

        describe('originalText:', function () {

            it('should be observable', function () {
                viewModel = ctor(questionId, null);
                expect(viewModel.originalText).toBeObservable();
            });

            describe('when content is null', function () {
                it('should be equal to text', function () {
                    viewModel = ctor(questionId, null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });

            describe('when content is empty string', function () {
                it('should be equal to text', function () {
                    viewModel = ctor(questionId, null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });

            describe('when content is string', function () {
                it('should be equal to text', function () {
                    viewModel = ctor(questionId, null);
                    expect(viewModel.originalText()).toBe(viewModel.text());
                });
            });
        });

        describe('beginEditText:', function () {

            it('should be function', function () {
                expect(viewModel.beginEditText).toBeFunction();
            });

            it('should send event \'Start editing question content\'', function () {
                viewModel.beginEditText({});
                expect(eventTracker.publish).toHaveBeenCalledWith('Start editing question content');
            });
        });

        describe('endEditText:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, null);
            });

            it('should be function', function () {
                expect(viewModel.endEditText).toBeFunction();
            });

            it('should send event \'End editing question content\'', function () {
                viewModel.endEditText();
                expect(eventTracker.publish).toHaveBeenCalledWith('End editing question content');
            });

        });

        describe('defineQuestionContent:', function () {
            beforeEach(function () {
                viewModel = ctor(questionId, null);
            });

            it('should be function', function () {
                expect(viewModel.defineQuestionContent).toBeFunction();
            });

            it('should send event \'Define question content\'', function () {
                viewModel.defineQuestionContent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Define question content');
            });

            it('should set text to empty string', function () {
                viewModel.defineQuestionContent();
                expect(viewModel.text()).toBe('');
            });

            it('should set hasFocus to true', function () {
                viewModel.hasFocus(false);
                viewModel.defineQuestionContent();
                expect(viewModel.hasFocus()).toBe(true);
            });
        });

        describe('updateText:', function () {

            var updateContentDefer, promise;
            beforeEach(function () {
                viewModel = ctor(questionId, null);

                updateContentDefer = Q.defer();
                spyOn(repository, 'updateContent').andReturn(updateContentDefer.promise);
                promise = updateContentDefer.promise.fin(function () { });
            });

            it('should be function', function () {
                expect(viewModel.updateText).toBeFunction();
            });

            describe('when text is empty html', function () {
                var text = '<br/>';
                beforeEach(function () {
                    viewModel.text(text);
                });

                describe('when text was not changed', function () {
                    beforeEach(function () {
                        viewModel.originalText(null);
                    });

                    it('should set text to null', function () {
                        viewModel.updateText();
                        expect(viewModel.text()).toBe(null);
                    });

                    it('should not call repository update content', function () {
                        viewModel.updateText();
                        expect(repository.updateContent).not.toHaveBeenCalled();
                    });

                    it('should not show notification', function () {
                        viewModel.updateText();
                        expect(notify.info).not.toHaveBeenCalled();
                    });
                });
                
                describe('when text was changed', function () {
                    beforeEach(function () {
                        viewModel.originalText('text');
                    });
                    
                    it('should set text to null', function () {
                        viewModel.updateText();
                        expect(viewModel.text()).toBe(null);
                    });

                    it('should call repository update content with null content', function () {
                        viewModel.updateText();
                        expect(repository.updateContent).toHaveBeenCalledWith(questionId, null);
                    });

                    describe('and when request succeded', function () {

                        beforeEach(function () {
                            updateContentDefer.resolve(new Date());
                        });

                        it('should show notification', function () {
                            viewModel.updateText();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should set original text to null', function () {
                            viewModel.updateText();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.originalText()).toBe(null);
                            });
                        });
                    });
                });
               
            });
            
            describe('when text is not empty html', function () {
                var text = 'text';
                beforeEach(function () {
                    viewModel.text(text);
                });

                describe('when text was not changed', function () {
                    beforeEach(function () {
                        viewModel.originalText(text);
                    });

                    it('should not change text', function () {
                        viewModel.updateText();
                        expect(viewModel.text()).toBe(text);
                    });
                    
                    it('should not change original text', function () {
                        viewModel.updateText();
                        expect(viewModel.originalText()).toBe(text);
                    });

                    it('should not call repository update content', function () {
                        viewModel.updateText();
                        expect(repository.updateContent).not.toHaveBeenCalled();
                    });

                    it('should not show notification', function () {
                        viewModel.updateText();
                        expect(notify.info).not.toHaveBeenCalled();
                    });
                });

                describe('when text was changed', function () {
                    beforeEach(function () {
                        viewModel.originalText(null);
                    });

                    it('should call repository update content with text', function () {
                        viewModel.updateText();
                        expect(repository.updateContent).toHaveBeenCalledWith(questionId, text);
                    });

                    describe('and when request succeded', function () {

                        beforeEach(function () {
                            updateContentDefer.resolve(new Date());
                        });

                        it('should show notification', function () {
                            viewModel.text(text);
                            viewModel.updateText();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should set original text to text', function () {
                            viewModel.updateText();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.originalText()).toBe(text);
                            });
                        });
                    });
                });
              
            });

        });

        describe('isExpanded:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
            });

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

            it('should be true by default', function () {
                expect(viewModel.isExpanded()).toBeTruthy();
            });

        });

        describe('toggleExpand:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, []);
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
                viewModel = ctor(questionId, []);
            });

            it('should be number', function () {
                expect(viewModel.autosaveInterval).toEqual(jasmine.any(Number));
            });

        });

        describe('isQuestionContentDefined:', function () {

            beforeEach(function () {
                viewModel = ctor(questionId, null);
            });

            it('should be computed', function () {
                expect(viewModel.isQuestionContentDefined).toBeComputed();
            });

            describe('when text is null', function () {

                it('should be false', function () {
                    viewModel.text(null);
                    expect(viewModel.isQuestionContentDefined()).toBeFalsy();
                });

            });

            describe('when text is not null', function () {

                it('should be true', function () {
                    viewModel.text('some text');
                    expect(viewModel.isQuestionContentDefined()).toBeTruthy();
                });

            });

        });

    });

});