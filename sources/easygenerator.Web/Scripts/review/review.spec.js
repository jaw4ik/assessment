define([], function () {
    "use strict";

    var viewModel = app.reviewViewModel();

    describe('viewModel [review]', () => {

        describe('isExpanded:', () => {
            it('should be observable', () => {
                expect(viewModel.isExpanded).toBeObservable();
            });
        });

        describe('isSaved:', () => {
            it('should be observeble', () => {
                expect(viewModel.isSaved).toBeObservable();
            });
        });

        describe('isFailed:', () => {
            it('should be observeble', () => {
                expect(viewModel.isFailed).toBeObservable();
            });
        });

        describe('text:', () => {
            it('should be observable', () => {
                expect(viewModel.text).toBeObservable();
            });
        });

        describe('name:', () => {
            it('should be observable', () => {
                expect(viewModel.name).toBeObservable();
            });
        });

        describe('email:', () => {
            it('should be observable', () => {
                expect(viewModel.email).toBeObservable();
            });
        });

        describe('showIdentifyUserForm:', () => {
            it('should be observable', () => {
                expect(viewModel.showIdentifyUserForm).toBeObservable();
            });
        });

        describe('showTextValidationError:', () => {
            it('should be observable', () => {
                expect(viewModel.showTextValidationError).toBeObservable();
            });
        });

        describe('showNameValidationError:', () => {
            it('should be observable', () => {
                expect(viewModel.showNameValidationError).toBeObservable();
            });
        });

        describe('showEmailValidationError:', () => {
            it('should be observable', () => {
                expect(viewModel.showEmailValidationError).toBeObservable();
            });
        });
        
        describe('onTextFocused:', () => {
            it('should be function', () => {
                expect(viewModel.onTextFocused).toBeFunction();
            });

            it('should set showTextValidationError to false', () => {
                viewModel.showTextValidationError(true);
                viewModel.onTextFocused();
                expect(viewModel.showTextValidationError()).toBeFalsy();
            });
        });

        describe('onCollapsed:', () => {
            it('should be function', () => {
                expect(viewModel.onCollapsed).toBeFunction();
            });

            it('should set isSaved to false', () => {
                viewModel.isSaved(true);
                viewModel.onCollapsed();
                expect(viewModel.isSaved()).toBeFalsy();
            });


            it('should set isFailed to false', () => {
                viewModel.isFailed(true);
                viewModel.onCollapsed();
                expect(viewModel.isFailed()).toBeFalsy();
            });
        });

        describe('toggleVisiblity:', () => {
            it('should be function', () => {
                expect(viewModel.toggleVisiblity).toBeFunction();
            });

            describe('when isExpanded true', () => {
                beforeEach(() => {
                    viewModel.isExpanded(true);
                });

                it('should set isExpanded to false', () => {
                    viewModel.toggleVisiblity();
                    expect(viewModel.isExpanded()).toBeFalsy();
                });
            });

            describe('when isExpanded false', () => {
                beforeEach(() => {
                    viewModel.isExpanded(false);
                });

                it('should set isExpanded to true', () => {
                    viewModel.toggleVisiblity();
                    expect(viewModel.isExpanded()).toBeTruthy();
                });
            });
        });

        describe('addComment:', () => {

            var addCommentDeferred, courseId = 'courseId';

            beforeEach(() => {
                addCommentDeferred = $.Deferred();
                spyOn($, "ajax").and.returnValue(addCommentDeferred.promise());
            });

            it('should be function', () => {
                expect(viewModel.addComment).toBeFunction();
            });

            describe('when course id is not specified', () => {

                it('should throw exception', () => {
                    var f = () => {
                        viewModel.addComment(undefined);
                    };

                    expect(f).toThrow('Course id is not specified');
                });
            });

            describe('when course id is specified', () => {

                describe('when text is empty', () => {
                    beforeEach(() => {
                        viewModel.text('');
                    });

                    it('should set showTextValidationError to true', () => {
                        viewModel.showTextValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.showTextValidationError()).toBeTruthy();
                    });

                });

                describe('when text is whitespace', () => {
                    beforeEach(() => {
                        viewModel.text('   ');
                    });

                    it('should set showTextValidationError to true', () => {
                        viewModel.showTextValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.showTextValidationError()).toBeTruthy();
                    });
                });

                describe('when text is string', () => {
                    var text = 'comment',
                        name = 'name',
                        email = 'user@user.user';

                    beforeEach(function () {
                        viewModel.text(text);
                        viewModel.name(name);
                        viewModel.email(email);

                        spyOn(localStorage, 'setItem');
                    });

                    it('should set isSaved to false', () => {
                        spyOn(localStorage, 'getItem').and.returnValue(name);
                        viewModel.isSaved(true);

                        viewModel.addComment(courseId);
                        expect(viewModel.isSaved()).toBeFalsy();
                    });

                    it('should set isFailed to false', () => {
                        spyOn(localStorage, 'getItem').and.returnValue(name);
                        viewModel.isFailed(true);

                        viewModel.addComment(courseId);
                        expect(viewModel.isFailed()).toBeFalsy();
                    });

                    it('should get username and usermail from local storage', () => {
                        spyOn(localStorage, 'getItem').and.returnValue(name);

                        viewModel.addComment(courseId);
                        expect(localStorage.getItem).toHaveBeenCalled();
                    });

                    describe('when username is null', () => {
                        it('should show identify form', () => {
                            viewModel.showIdentifyUserForm(false);
                            spyOn(localStorage, 'getItem').and.returnValue(null);

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when username is empty', () => {
                        it('should show identify form', () => {
                            viewModel.showIdentifyUserForm(false);
                            spyOn(localStorage, 'getItem').and.returnValue('');

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when username is whitespace', () => {
                        it('should show identify form', () => {
                            viewModel.showIdentifyUserForm(false);
                            spyOn(localStorage, 'getItem').and.returnValue('    ');

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when identify user form is shown', () => {

                        beforeEach(() => {
                            viewModel.showIdentifyUserForm(true);
                            viewModel.showNameValidationError(false);
                            viewModel.showEmailValidationError(false);
                        });

                        describe('when name is null', () => {
                            it('should show NameValidationError', function () {
                                viewModel.name(null);
                                viewModel.addComment(courseId);
                                expect(viewModel.showNameValidationError()).toBeTruthy();

                            });
                        });

                        describe('when name is whitespace', () => {
                            it('should show NameValidationError', function () {
                                viewModel.name('   ');
                                viewModel.addComment(courseId);
                                expect(viewModel.showNameValidationError()).toBeTruthy();

                            });
                        });

                        describe('when email is null', () => {
                            it('should show EmailValidationError', function () {
                                viewModel.email(null);
                                viewModel.addComment(courseId);
                                expect(viewModel.showEmailValidationError()).toBeTruthy();

                            });
                        });

                        describe('when email is whitespace', () => {
                            it('should show EmailValidationError', function () {
                                viewModel.email('   ');
                                viewModel.addComment(courseId);
                                expect(viewModel.showEmailValidationError()).toBeTruthy();

                            });
                        });

                        describe('when name and email are strings', () => {
                            beforeEach(() => {
                                viewModel.name(name);
                                viewModel.email(email);
                            });

                            it('should save name to local storage', function() {
                                viewModel.addComment(courseId);
                                expect(localStorage.setItem).toHaveBeenCalledWith('usernameForReview', name);
                            });

                            it('should save email to local storage', function () {
                                viewModel.addComment(courseId);
                                expect(localStorage.setItem).toHaveBeenCalledWith('usermailForReview', email);
                            });
                        });
                    });

                    describe('when username and usermail are strings', () => {

                        it('should send request to /api/comment/create and trim values before sending request', () => {
                            spyOn(localStorage, 'getItem').and.returnValue(`   ${email}    `);
                            viewModel.text(`   ${text}    `);

                            viewModel.addComment(courseId);

                            expect($.ajax).toHaveBeenCalledWith({
                                url: '/api/comment/create',
                                data: { courseId: courseId, text: text, createdByName: email, createdBy: email },
                                type: 'POST'
                            });
                        });

                        describe('when request failed', () => {

                            beforeEach(() => {
                                spyOn(localStorage, 'getItem').and.returnValue(email);
                            });

                            it('should set isFailed to true', (done) => {
                                viewModel.addComment(courseId).always(() => {
                                    expect(viewModel.isFailed()).toBeTruthy();
                                    done();
                                });

                                addCommentDeferred.reject();
                            });

                        });

                        describe('when request succeed', () => {

                            describe('and response is not an object', () => {

                                beforeEach(() => {
                                    spyOn(localStorage, 'getItem').and.returnValue(email);
                                });

                                it('should throw exception', () => {
                                    var f = () => {
                                        viewModel.addComment(courseId);
                                    };
                                    addCommentDeferred.resolve();

                                    expect(f).toThrow('Response is not an object');
                                });

                            });

                            describe('and response is not successful', () => {

                                beforeEach(() => {
                                    spyOn(localStorage, 'getItem').and.returnValue(email);
                                });

                                it('should set isFailed to true', (done) => {
                                    viewModel.isFailed(false);

                                    viewModel.addComment(courseId).always(() => {
                                        expect(viewModel.isFailed()).toBeTruthy();
                                        done();
                                    });

                                    addCommentDeferred.resolve({ success: false });
                                });
                            });

                            xdescribe('and response is successful', () => {

                                beforeEach(() => {
                                    spyOn(localStorage, 'getItem').and.returnValue(email);
                                });

                                it('should clear text', (done) => {
                                    viewModel.text('test');
                                    viewModel.addComment(courseId).always(() => {
                                        expect(viewModel.text()).toBe('');
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });

                                it('should set isSaved to true', (done) => {
                                    viewModel.isSaved(false);
                                    viewModel.addComment(courseId).always(() => {
                                        expect(viewModel.isSaved()).toBeTruthy();
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });

                                it('should hide identify user form', (done) => {
                                    viewModel.showIdentifyUserForm(true);
                                    viewModel.addComment(courseId).always(() => {
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