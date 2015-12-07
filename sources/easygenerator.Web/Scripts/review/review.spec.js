define([], function () {
    "use strict";

    var viewModel = app.reviewViewModel();

    describe('viewModel [review]', function(){

        describe('isExpanded:', function(){
            it('should be observable', function(){
                expect(viewModel.isExpanded).toBeObservable();
            });
        });

        describe('isSaved:', function(){
            it('should be observeble', function(){
                expect(viewModel.isSaved).toBeObservable();
            });
        });

        describe('isFailed:', function(){
            it('should be observeble', function(){
                expect(viewModel.isFailed).toBeObservable();
            });
        });

        describe('text:', function(){
            it('should be observable', function(){
                expect(viewModel.text).toBeObservable();
            });
        });

        describe('name:', function(){
            it('should be observable', function(){
                expect(viewModel.name).toBeObservable();
            });
        });

        describe('email:', function(){
            it('should be observable', function(){
                expect(viewModel.email).toBeObservable();
            });
        });

        describe('showIdentifyUserForm:', function(){
            it('should be observable', function(){
                expect(viewModel.showIdentifyUserForm).toBeObservable();
            });
        });

        describe('showTextValidationError:', function(){
            it('should be observable', function(){
                expect(viewModel.showTextValidationError).toBeObservable();
            });
        });

        describe('showNameValidationError:', function(){
            it('should be observable', function(){
                expect(viewModel.showNameValidationError).toBeObservable();
            });
        });

        describe('showEmailValidationError:', function(){
            it('should be observable', function(){
                expect(viewModel.showEmailValidationError).toBeObservable();
            });
        });
        
        describe('onTextFocused:', function(){
            it('should be function', function(){
                expect(viewModel.onTextFocused).toBeFunction();
            });

            it('should set showTextValidationError to false', function(){
                viewModel.showTextValidationError(true);
                viewModel.onTextFocused();
                expect(viewModel.showTextValidationError()).toBeFalsy();
            });
        });

        describe('onCollapsed:', function(){
            it('should be function', function(){
                expect(viewModel.onCollapsed).toBeFunction();
            });

            it('should set isSaved to false', function(){
                viewModel.isSaved(true);
                viewModel.onCollapsed();
                expect(viewModel.isSaved()).toBeFalsy();
            });


            it('should set isFailed to false', function(){
                viewModel.isFailed(true);
                viewModel.onCollapsed();
                expect(viewModel.isFailed()).toBeFalsy();
            });
        });

        describe('toggleVisiblity:', function(){
            it('should be function', function(){
                expect(viewModel.toggleVisiblity).toBeFunction();
            });

            describe('when isExpanded true', function(){
                beforeEach(function(){
                    viewModel.isExpanded(true);
                });

                it('should set isExpanded to false', function(){
                    viewModel.toggleVisiblity();
                    expect(viewModel.isExpanded()).toBeFalsy();
                });
            });

            describe('when isExpanded false', function(){
                beforeEach(function(){
                    viewModel.isExpanded(false);
                });

                it('should set isExpanded to true', function(){
                    viewModel.toggleVisiblity();
                    expect(viewModel.isExpanded()).toBeTruthy();
                });
            });
        });

        describe('addComment:', function(){

            var addCommentDeferred, courseId = 'courseId';

            beforeEach(function(){
                addCommentDeferred = $.Deferred();
                spyOn($, "ajax").and.returnValue(addCommentDeferred.promise());
            });

            it('should be function', function(){
                expect(viewModel.addComment).toBeFunction();
            });

            describe('when course id is not specified', function(){

                it('should throw exception', function(){
                    var f = function(){
                        viewModel.addComment(undefined);
                    };

                    expect(f).toThrow('Course id is not specified');
                });
            });

            describe('when course id is specified', function(){

                describe('when text is empty', function(){
                    beforeEach(function(){
                        viewModel.text('');
                    });

                    it('should set showTextValidationError to true', function(){
                        viewModel.showTextValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.showTextValidationError()).toBeTruthy();
                    });

                });

                describe('when text is whitespace', function(){
                    beforeEach(function(){
                        viewModel.text('   ');
                    });

                    it('should set showTextValidationError to true', function(){
                        viewModel.showTextValidationError(false);
                        viewModel.addComment(courseId);
                        expect(viewModel.showTextValidationError()).toBeTruthy();
                    });
                });

                describe('when text is string', function(){
                    var text = 'comment',
                        name = 'name',
                        email = 'user@user.user';

                    beforeEach(function () {
                        viewModel.text(text);
                        viewModel.name(name);
                        viewModel.email(email);

                        spyOn(localStorage, 'setItem');
                    });

                    it('should set isSaved to false', function(){
                        spyOn(localStorage, 'getItem').and.returnValue(name);
                        viewModel.isSaved(true);

                        viewModel.addComment(courseId);
                        expect(viewModel.isSaved()).toBeFalsy();
                    });

                    it('should set isFailed to false', function(){
                        spyOn(localStorage, 'getItem').and.returnValue(name);
                        viewModel.isFailed(true);

                        viewModel.addComment(courseId);
                        expect(viewModel.isFailed()).toBeFalsy();
                    });

                    it('should get username and usermail from local storage', function(){
                        spyOn(localStorage, 'getItem').and.returnValue(name);

                        viewModel.addComment(courseId);
                        expect(localStorage.getItem).toHaveBeenCalled();
                    });

                    describe('when username is null', function(){
                        it('should show identify form', function(){
                            viewModel.showIdentifyUserForm(false);
                            spyOn(localStorage, 'getItem').and.returnValue(null);

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when username is empty', function(){
                        it('should show identify form', function(){
                            viewModel.showIdentifyUserForm(false);
                            spyOn(localStorage, 'getItem').and.returnValue('');

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when username is whitespace', function(){
                        it('should show identify form', function(){
                            viewModel.showIdentifyUserForm(false);
                            spyOn(localStorage, 'getItem').and.returnValue('    ');

                            viewModel.addComment(courseId);
                            expect(viewModel.showIdentifyUserForm()).toBeTruthy();
                        });
                    });

                    describe('when identify user form is shown', function(){

                        beforeEach(function(){
                            viewModel.showIdentifyUserForm(true);
                            viewModel.showNameValidationError(false);
                            viewModel.showEmailValidationError(false);
                        });

                        describe('when name is null', function(){
                            it('should show NameValidationError', function () {
                                viewModel.name(null);
                                viewModel.addComment(courseId);
                                expect(viewModel.showNameValidationError()).toBeTruthy();

                            });
                        });

                        describe('when name is whitespace', function(){
                            it('should show NameValidationError', function () {
                                viewModel.name('   ');
                                viewModel.addComment(courseId);
                                expect(viewModel.showNameValidationError()).toBeTruthy();

                            });
                        });

                        describe('when email is null', function(){
                            it('should show EmailValidationError', function () {
                                viewModel.email(null);
                                viewModel.addComment(courseId);
                                expect(viewModel.showEmailValidationError()).toBeTruthy();

                            });
                        });

                        describe('when email is whitespace', function(){
                            it('should show EmailValidationError', function () {
                                viewModel.email('   ');
                                viewModel.addComment(courseId);
                                expect(viewModel.showEmailValidationError()).toBeTruthy();

                            });
                        });

                        describe('when name and email are strings', function(){
                            beforeEach(function(){
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

                    describe('when username and usermail are strings', function(){

                        it('should send request to /api/comment/create and trim values before sending request', function(){
                            spyOn(localStorage, 'getItem').and.returnValue('   ' + email + '   ');
                            viewModel.text('   ' + text + '   ');

                            viewModel.addComment(courseId);

                            expect($.ajax).toHaveBeenCalledWith({
                                url: '/api/comment/create',
                                data: { courseId: courseId, text: text, createdByName: email, createdBy: email },
                                type: 'POST'
                            });
                        });

                        describe('when request failed', function(){

                            beforeEach(function(){
                                spyOn(localStorage, 'getItem').and.returnValue(email);
                            });

                            it('should set isFailed to true', function(done){
                                viewModel.addComment(courseId).always(function(){
                                    expect(viewModel.isFailed()).toBeTruthy();
                                    done();
                                });

                                addCommentDeferred.reject();
                            });

                        });

                        describe('when request succeed', function(){

                            describe('and response is not an object', function(){

                                beforeEach(function(){
                                    spyOn(localStorage, 'getItem').and.returnValue(email);
                                });

                                it('should throw exception', function(){
                                    var f = function(){
                                        viewModel.addComment(courseId);
                                    };
                                    addCommentDeferred.resolve();

                                    expect(f).toThrow('Response is not an object');
                                });

                            });

                            describe('and response is not successful', function(){

                                beforeEach(function(){
                                    spyOn(localStorage, 'getItem').and.returnValue(email);
                                });

                                it('should set isFailed to true', function(done){
                                    viewModel.isFailed(false);

                                    viewModel.addComment(courseId).always(function(){
                                        expect(viewModel.isFailed()).toBeTruthy();
                                        done();
                                    });

                                    addCommentDeferred.resolve({ success: false });
                                });
                            });

                            describe('and response is successful', function(){

                                beforeEach(function(){
                                    spyOn(localStorage, 'getItem').and.returnValue(email);
                                });

                                it('should clear text', function(done){
                                    viewModel.text('test');
                                    viewModel.addComment(courseId).always(function(){
                                        expect(viewModel.text()).toBe('');
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });

                                it('should set isSaved to true', function(done){
                                    viewModel.isSaved(false);
                                    viewModel.addComment(courseId).always(function(){
                                        expect(viewModel.isSaved()).toBeTruthy();
                                        done();
                                    });
                                    addCommentDeferred.resolve({ success: true });
                                });

                                it('should hide identify user form', function(done){
                                    viewModel.showIdentifyUserForm(true);
                                    viewModel.addComment(courseId).always(function(){
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