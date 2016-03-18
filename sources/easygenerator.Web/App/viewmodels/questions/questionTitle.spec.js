import vmQuestionTitle from './questionTitle';
import eventTracker from 'eventTracker';
import questionRepository from 'repositories/questionRepository';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import notify from 'notify';

describe('viewModel [questionTitlte]', function () {

    var sectionId, question, viewModel;

    beforeEach(function () {
        sectionId = 'sectionId';
        question = {
            id: 'questionId',
            title: 'Question title',
            type: ''
        };
        spyOn(eventTracker, 'publish');

        viewModel = vmQuestionTitle(sectionId, question);
    });

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });

    describe('text:', function () {

        it('should be observable', function () {
            expect(viewModel.text).toBeObservable();
        });

        describe('isEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.text.isEditing).toBeObservable();
            });

        });

        describe('isValid:', function () {

            it('should be observable', function () {
                expect(viewModel.text.isValid).toBeComputed();
            });

            describe('when title length more than 0 and less than 255', function () {

                it('should return true', function () {
                    viewModel.text('Question title');
                    expect(viewModel.text.isValid()).toBeTruthy();
                });

            });

            describe('when title length equal 0 or more than 255 ', function () {

                it('should return false', function () {
                    viewModel.text('');
                    expect(viewModel.text.isValid()).toBeFalsy();
                });

            });

        });

        describe('trim:', function () {

            it('should be function', function () {
                expect(viewModel.text.trim).toBeFunction();
            });

            it('should trim title value', function () {
                viewModel.text('   asd    ');
                viewModel.text.trim();
                expect(viewModel.text()).toBe('asd');
            });

        });

    });

    describe('label:', () => {
        it('should be defined', () => {
            expect(viewModel.label).toBeDefined();
        });

        it('should be question title label', () => {
            expect(viewModel.label).toBe('questionTitleLabel');
        });

        describe('when question type is information content', () => {

            it('should be content title label', () => {
                question.type = constants.questionType.informationContent.type;
                viewModel = vmQuestionTitle(sectionId, question);
                expect(viewModel.label).toBe('contentTitleLabel');
            });
            
        });

    });

    describe('questionTitleMaxLength:', function () {

        it('should be defined', function () {
            expect(viewModel.questionTitleMaxLength).toBeDefined();
        });

        it('should be equal to ' + constants.validation.questionTitleMaxLength, function () {
            expect(viewModel.questionTitleMaxLength).toBe(constants.validation.questionTitleMaxLength);
        });

    });

    describe('isCreatedQuestion:', function () {

        it('should be defined', function () {
            expect(viewModel.isCreatedQuestion).toBeDefined();
        });

    });

    describe('startEditQuestionTitle:', function () {

        it('should be function', function () {
            expect(viewModel.startEditQuestionTitle).toBeFunction();
        });

        it('should set title.isEditing to true', function () {
            viewModel.text.isEditing(false);
            viewModel.startEditQuestionTitle();
            expect(viewModel.text.isEditing()).toBeTruthy();
        });

    });

    describe('endEditQuestionTitle:', function () {
        var updateDeferred, getByIdDeferred;
        var errorMessage = 'error';
        beforeEach(function () {
            updateDeferred = Q.defer();
            getByIdDeferred = Q.defer();

            spyOn(notify, 'error');
            spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            spyOn(questionRepository, 'updateTitle').and.returnValue(updateDeferred.promise);
            spyOn(questionRepository, 'getById').and.returnValue(getByIdDeferred.promise);
            question = {
                id: 'questionId',
                title: 'Question title'
            };
        });

        it('should be function', function () {
            expect(viewModel.endEditQuestionTitle).toBeFunction();
        });

        it('should set text.isEditing to false', function () {
            viewModel.text.isEditing(true);
            viewModel.endEditQuestionTitle();
            expect(viewModel.text.isEditing()).toBeFalsy();
        });

        it('should trim text', function () {
            viewModel.text('    Some title    ');
            viewModel.endEditQuestionTitle();
            expect(viewModel.text()).toEqual('Some title');
        });

        describe('when question is not found', function () {
            var promise = null;
            beforeEach(function () {
                viewModel.text(question.title);
                promise = getByIdDeferred.promise.finally(function () { });
                getByIdDeferred.reject();
            });

            it('should show error', function (done) {
                viewModel.endEditQuestionTitle();

                promise.fin(function () {
                    expect(notify.error).toHaveBeenCalledWith(errorMessage);
                    done();
                });
            });
        });

        describe('when text is not modified', function () {
            var promise = null;
            beforeEach(function () {
                viewModel.text(question.title);
                promise = getByIdDeferred.promise.finally(function () { });
                getByIdDeferred.resolve(question);
            });

            it('should not send event', function (done) {
                viewModel.endEditQuestionTitle();

                promise.fin(function () {
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not show notification', function (done) {
                spyOn(notify, 'saved');
                viewModel.endEditQuestionTitle();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    expect(notify.saved).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not update question in repository', function (done) {
                viewModel.endEditQuestionTitle();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    expect(questionRepository.updateTitle).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when text is modified', function () {

            var getPromise = null, newTitle = 'lala';
            beforeEach(function () {
                viewModel.text(newTitle);
                getPromise = getByIdDeferred.promise.finally(function () { });
                getByIdDeferred.resolve(question);
            });

            it('should send event \'Update question title\'', function (done) {
                viewModel.endEditQuestionTitle();

                getPromise.fin(function () {
                    expect(getPromise).toBeResolved();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Update question title');
                    done();
                });
            });

            describe('and when title is valid', function () {

                it('should update question in repository', function (done) {
                    viewModel.endEditQuestionTitle();

                    getPromise.fin(function () {
                        expect(getPromise).toBeResolved();
                        expect(questionRepository.updateTitle).toHaveBeenCalled();
                        expect(questionRepository.updateTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                        done();
                    });
                });

                describe('and when question updated successfully', function () {

                    it('should update notificaion', function (done) {
                        spyOn(notify, 'saved');

                        viewModel.endEditQuestionTitle();

                        var promise = updateDeferred.promise.finally(function () { });
                        updateDeferred.resolve(question);

                        Q.all(getPromise, promise).fin(function () {
                            expect(promise).toBeResolved();
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

            describe('and when title is not valid', function () {

                it('should revert quiestion text value', function (done) {
                    viewModel.text('');
                    viewModel.endEditQuestionTitle();

                    getPromise.fin(function () {
                        expect(viewModel.text()).toBe(question.title);
                        done();
                    });
                });

            });
        });

    });

    describe('isExpanded:', function () {

        it('should be observable', function () {
            expect(viewModel.isExpanded).toBeObservable();
        });

    });

    describe('toggleExpand:', function () {

        it('should be function', function () {
            expect(viewModel.toggleExpand).toBeFunction();
        });

        it('should toggle isExpanded', function () {
            viewModel.isExpanded(false);

            viewModel.toggleExpand();

            expect(viewModel.isExpanded()).toBeTruthy();
        });

    });

});
