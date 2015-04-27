define([], function () {
    "use strict";

    var viewModel = app.reviewViewModel();

    describe('viewModel [review]', function () {

        describe('isExpanded:', function () {
            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });
        });

        describe('text:', function () {
            it('should be observable', function () {
                expect(viewModel.text).toBeObservable();
            });
        });

        describe('hasValidationError:', function () {
            it('should be observable', function () {
                expect(viewModel.hasValidationError).toBeObservable();
            });
        });

        describe('isSaved:', function () {
            it('should be observeble', function () {
                expect(viewModel.isSaved).toBeObservable();
            });
        });

        describe('isFailed:', function () {
            it('should be observeble', function () {
                expect(viewModel.isFailed).toBeObservable();
            });
        });

        describe('onTextFocused:', function () {
            it('should be function', function () {
                expect(viewModel.onTextFocused).toBeFunction();
            });

            it('should set isTextValidationErrorVisible to false', function () {
                viewModel.hasValidationError(true);
                viewModel.onTextFocused();
                expect(viewModel.hasValidationError()).toBeFalsy();
            });
        });

        describe('onCollapsed:', function () {
            it('should be function', function () {
                expect(viewModel.onCollapsed).toBeFunction();
            });

            it('should set isSaved to false', function () {
                viewModel.isSaved(true);
                viewModel.onCollapsed();
                expect(viewModel.isSaved()).toBeFalsy();
            });


            it('should set isFailed to false', function () {
                viewModel.isFailed(true);
                viewModel.onCollapsed();
                expect(viewModel.isFailed()).toBeFalsy();
            });
        });

        describe('toggleVisiblity:', function () {
            it('should be function', function () {
                expect(viewModel.toggleVisiblity).toBeFunction();
            });

            describe('when isExpanded true', function () {
                beforeEach(function () {
                    viewModel.isExpanded(true);
                });

                it('should set isExpanded to false', function () {
                    viewModel.toggleVisiblity();
                    expect(viewModel.isExpanded()).toBeFalsy();
                });
            });

            describe('when isExpanded false', function () {
                beforeEach(function () {
                    viewModel.isExpanded(false);
                });

                it('should set isVisible to true', function () {
                    viewModel.toggleVisiblity();
                    expect(viewModel.isExpanded()).toBeTruthy();
                });
            });
        });

        describe('addComment:', function () {

            var addCommentDeferred, courseId = 'courseId';

            beforeEach(function () {
                addCommentDeferred = $.Deferred();
                spyOn($, "ajax").and.returnValue(addCommentDeferred.promise());
            });

            it('should be function', function () {
                expect(viewModel.addComment).toBeFunction();
            });

            describe('when course id is not specified', function () {

                it('should throw exception', function () {
                    var f = function () {
                        viewModel.addComment(undefined);
                    };

                    expect(f).toThrow('Course id is not specified');
                });
            });

            describe('when course id is specified', function () {

                describe('when text is empty', function () {
                    beforeEach(function () {
                        viewModel.text('');
                    });

                    it('should set hasValidationError to true', function () {
                        viewModel.hasValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.hasValidationError()).toBeTruthy();
                    });

                    it('should set isSaved to false', function () {
                        viewModel.isSaved(true);
                        viewModel.addComment(courseId);
                        expect(viewModel.isSaved()).toBeFalsy();
                    });

                    it('should set isFailed to false', function () {
                        viewModel.isFailed(true);
                        viewModel.addComment(courseId);
                        expect(viewModel.isFailed()).toBeFalsy();
                    });

                    it('should not send request to /api/comment/create', function () {
                        viewModel.addComment(courseId);

                        expect($.ajax).not.toHaveBeenCalled();
                    });
                });

                describe('when text is whitespace', function () {
                    beforeEach(function () {
                        viewModel.text('   ');
                    });

                    it('should set hasValidationError to true', function () {
                        viewModel.hasValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.hasValidationError()).toBeTruthy();
                    });

                    it('should set isSaved to false', function () {
                        viewModel.isSaved(true);
                        viewModel.addComment(courseId);
                        expect(viewModel.isSaved()).toBeFalsy();
                    });

                    it('should set isFailed to false', function () {
                        viewModel.isFailed(true);
                        viewModel.addComment(courseId);
                        expect(viewModel.isFailed()).toBeFalsy();
                    });

                    it('should not send request to /api/comment/create', function () {
                        viewModel.addComment(courseId);

                        expect($.ajax).not.toHaveBeenCalled();
                    });
                });

                describe('when text is string', function () {
                    var text = 'comment';
                    beforeEach(function () {
                        viewModel.text(text);
                    });

                    it('should set isSaved to false', function () {
                        viewModel.isSaved(true);
                        viewModel.addComment(courseId);
                        expect(viewModel.isSaved()).toBeFalsy();
                    });

                    it('should set isFailed to false', function () {
                        viewModel.isFailed(true);
                        viewModel.addComment(courseId);
                        expect(viewModel.isFailed()).toBeFalsy();
                    });

                    it('should trim text before sending request', function () {
                        viewModel.text("   " + text + "    ");

                        viewModel.addComment(courseId);

                        expect($.ajax).toHaveBeenCalledWith({
                            url: '/api/comment/create',
                            data: { courseId: courseId, text: text },
                            type: 'POST'
                        });
                    });

                    it('should send request to /api/comment/create', function () {
                        viewModel.addComment(courseId);

                        expect($.ajax).toHaveBeenCalledWith({
                            url: '/api/comment/create',
                            data: { courseId: courseId, text: text },
                            type: 'POST'
                        });
                    });

                    describe('when request failed', function () {

                        beforeEach(function (done) {
                            addCommentDeferred.reject();
                            done();
                        });

                        it('should set isFailed to true', function () {
                            viewModel.addComment(courseId);
                            expect(viewModel.isFailed()).toBeTruthy();
                        });

                    });

                    describe('when request succeed', function () {

                        describe('and response is not an object', function () {

                            beforeEach(function (done) {
                                addCommentDeferred.resolve();
                                done();
                            });

                            it('should throw exception', function () {
                                var f = function () {
                                    viewModel.addComment(courseId);
                                };
                                expect(f).toThrow('Response is not an object');
                            });

                        });

                        describe('and response is not successful', function () {

                            beforeEach(function (done) {
                                addCommentDeferred.resolve({ success: false });
                                done();
                            });

                            it('should set isFailed to true', function () {
                                viewModel.addComment(courseId);
                                expect(viewModel.isFailed()).toBeTruthy();
                            });

                        });

                        describe('and response is successful', function () {

                            beforeEach(function (done) {
                                addCommentDeferred.resolve({ success: true });
                                done();
                            });

                            it('should clear text', function () {
                                viewModel.addComment(courseId);
                                expect(viewModel.text()).toBe('');
                            });

                            it('should set isSaved to true', function () {
                                viewModel.addComment(courseId);
                                expect(viewModel.isSaved()).toBeTruthy();
                            });

                        });

                    });

                });

            });

        });

    });

});