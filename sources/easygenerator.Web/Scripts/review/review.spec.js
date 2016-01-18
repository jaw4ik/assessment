define([], function () {
    "use strict";

    var storage = {};
    var mockStorage = {
        setItem: function(key, value) {
            storage[key] = value;
        },
        getItem: function(key) {
            return storage[key];
        },
        clear: function() {
            storage = {};
        }
    };

    var viewModel = app.reviewViewModel(mockStorage);

    describe('viewModel [review]', function () {

        describe('isExpanded:', function () {
            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
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

        describe('text:', function () {
            it('should be observable', function () {
                expect(viewModel.text).toBeObservable();
            });
        });

        describe('name:', function () {
            it('should be observable', function () {
                expect(viewModel.name).toBeObservable();
            });

            describe('when name is null', function () {
                it('should set isValid to false', function () {
                    viewModel.name(null);
                    expect(viewModel.name.isValid()).toBeFalsy();

                });
            });

            describe('when name is whitespace', function () {
                it('should set isValid to false', function () {
                    viewModel.name('   ');
                    expect(viewModel.name.isValid()).toBeFalsy();

                });
            });
        });

        describe('email:', function () {
            it('should be observable', function () {
                expect(viewModel.email).toBeObservable();
            });

            describe('when email is null', function () {
                it('should set isValid to false', function () {
                    viewModel.email(null);
                    expect(viewModel.email.isValid()).toBeFalsy();

                });
            });

            describe('when email is whitespace', function () {
                it('should set isValid to false', function () {
                    viewModel.email('   ');
                    expect(viewModel.email.isValid()).toBeFalsy();

                });
            });

            describe('when email is not valid email', function () {
                it('should set isValid to false', function () {
                    viewModel.email('test');
                    expect(viewModel.email.isValid()).toBeFalsy();

                });
            });
        });

        describe('showIdentifyUserForm:', function () {
            it('should be observable', function () {
                expect(viewModel.showIdentifyUserForm).toBeObservable();
            });
        });

        describe('showTextValidationError:', function () {
            it('should be observable', function () {
                expect(viewModel.showTextValidationError).toBeObservable();
            });
        });

        describe('onTextFocused:', function () {
            it('should set showTextValidationError to false', function () {
                viewModel.showTextValidationError(true);
                viewModel.onTextFocused();
                expect(viewModel.showTextValidationError()).toBeFalsy();
            });
        });

        describe('onCollapsed:', function () {
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

                it('should set isExpanded to true', function () {
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

                    it('should set showTextValidationError to true', function () {
                        viewModel.showTextValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.showTextValidationError()).toBeTruthy();
                    });

                });

                describe('when text is whitespace', function () {
                    beforeEach(function () {
                        viewModel.text('   ');
                    });

                    it('should set showTextValidationError to true', function () {
                        viewModel.showTextValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.showTextValidationError()).toBeTruthy();
                    });
                });

                describe('when text is string', function () {
                    var text = 'comment',
                        name = 'name',
                        email = 'user@user.user';

                    beforeEach(function () {
                        viewModel.text(text);
                        viewModel.name(name);
                        viewModel.email(email);

                        mockStorage.clear();
                    });

                    describe('when username and usermail are not saved in storage', function () {
                        it('should show identify form', function () {
                            viewModel.showIdentifyUserForm(false);
                            
                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when username is empty', function () {
                        it('should show identify form', function () {
                            viewModel.showIdentifyUserForm(false);
                            mockStorage.setItem('usernameForReview', '');

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when username is whitespace', function () {
                        it('should show identify form', function () {
                            viewModel.showIdentifyUserForm(false);
                            mockStorage.setItem('usernameForReview','         ');

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when identify user form is shown', function () {

                        beforeEach(function () {
                            viewModel.showIdentifyUserForm(true);
                        });

                        describe('when name is null', function() {
                            it('should not save name to localStorage', function() {
                                viewModel.name(null);
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usernameForReview')).not.toBeDefined();
                            });
                        });

                        describe('when name is empty', function () {
                            it('should not save name to localStorage', function () {
                                viewModel.name('');
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usernameForReview')).not.toBeDefined();
                            });
                        });

                        describe('when name is whitespace', function () {
                            it('should not save name to localStorage', function () {
                                viewModel.name('    ');
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usernameForReview')).not.toBeDefined();
                            });
                        });

                        describe('when email is null', function () {
                            it('should not save email to localStorage', function () {
                                viewModel.email(null);
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usermailForReview')).not.toBeDefined();
                            });
                        });

                        describe('when email is empty', function () {
                            it('should not save email to localStorage', function () {
                                viewModel.email('');
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usermailForReview')).not.toBeDefined();
                            });
                        });

                        describe('when email is whitespace', function () {
                            it('should not save email to localStorage', function () {
                                viewModel.email('     ');
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usermailForReview')).not.toBeDefined();
                            });
                        });

                        describe('when email is not valid', function () {
                            it('should not save email to localStorage', function () {
                                viewModel.email('test');
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usermailForReview')).not.toBeDefined();
                            });
                        });

                        describe('when name and email are valid', function () {
                            beforeEach(function () {
                                viewModel.name(name);
                                viewModel.email(email);
                            });

                            it('should save name to local storage', function () {
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usernameForReview')).toBe(name);
                            });

                            it('should save email to local storage', function () {
                                viewModel.addComment(courseId);
                                expect(mockStorage.getItem('usermailForReview')).toBe(email);
                            });
                        });
                    });

                    describe('when username and usermail are strings', function () {
                        beforeEach(function () {
                            mockStorage.setItem('usernameForReview', name);
                            mockStorage.setItem('usermailForReview', email);
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

                        it('should send request to /api/comment/create and trim values before sending request', function () {
                            viewModel.text('   ' + text + '   ');

                            viewModel.addComment(courseId);

                            expect($.ajax).toHaveBeenCalledWith({
                                url: '/api/comment/create',
                                data: { courseId: courseId, text: text, createdByName: name, createdBy: email },
                                type: 'POST'
                            });
                        });

                        describe('when request failed', function () {

                            it('should set isFailed to true', function (done) {
                                viewModel.addComment(courseId).always(function () {
                                    expect(viewModel.isFailed()).toBeTruthy();
                                    done();
                                });

                                addCommentDeferred.reject();
                            });

                        });

                        describe('when request succeed', function () {

                            describe('and response is not an object', function () {

                                it('should throw exception', function () {
                                    var f = function () {
                                        viewModel.addComment(courseId);
                                    };
                                    addCommentDeferred.resolve();

                                    expect(f).toThrow('Response is not an object');
                                });

                            });

                            describe('and response is not successful', function () {

                                it('should set isFailed to true', function (done) {
                                    viewModel.isFailed(false);

                                    viewModel.addComment(courseId).always(function () {
                                        expect(viewModel.isFailed()).toBeTruthy();
                                        done();
                                    });

                                    addCommentDeferred.resolve({ success: false });
                                });
                            });

                            describe('and response is successful', function () {

                                it('should clear text', function (done) {
                                    viewModel.text('test');
                                    viewModel.addComment(courseId).always(function () {
                                        expect(viewModel.text()).toBe('');
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });

                                it('should set isSaved to true', function (done) {
                                    viewModel.isSaved(false);
                                    viewModel.addComment(courseId).always(function () {
                                        expect(viewModel.isSaved()).toBeTruthy();
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });

                                it('should hide identify user form', function (done) {
                                    viewModel.showIdentifyUserForm(true);
                                    viewModel.addComment(courseId).always(function () {
                                        expect(viewModel.showIdentifyUserForm()).toBeFalsy();
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});