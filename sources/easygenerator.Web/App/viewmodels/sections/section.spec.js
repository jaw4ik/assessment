import viewModel from './section';

import router from 'routing/router';
import eventTracker from 'eventTracker';
import repository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import questionRepository from 'repositories/questionRepository';
import notify from 'notify';
import constants from 'constants';
import clientContext from 'clientContext';
import uploadImage from 'images/commands/upload';
import userContext from 'userContext';

describe('viewModel [section]', function () {

    var section = {
        id: '1',
        title: 'Test Section 1',
        createdOn: new Date(),
        modifiedOn: new Date(),
        image: 'image/url',
        questions: [
            { id: 0, title: 'A', type: 'multipleSelect' },
            { id: 1, title: 'b', type: 'multipleSelect' },
            { id: 2, title: 'B', type: 'multipleSelect' },
            { id: 3, title: 'a', type: 'multipleSelect' }
        ]
    };

    var instruction = { queryString: 'courseId=id1' };

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(router, 'replace');
        spyOn(router, 'activeInstruction').and.returnValue(instruction);
        spyOn(notify, 'saved');
    });

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('canActivate:', function () {

        var getSectionById, getCourseById;

        beforeEach(function () {
            getSectionById = Q.defer();
            getCourseById = Q.defer();

            spyOn(repository, 'getById').and.returnValue(getSectionById.promise);
            spyOn(courseRepository, 'getById').and.returnValue(getCourseById.promise);

        });
        it('should be function', function () {
            expect(viewModel.canActivate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.canActivate()).toBePromise();
        });

        describe('when activated with 1 argument', function () {

            describe('and section exists', function () {

                beforeEach(function () {
                    getSectionById.resolve({});
                });

                it('should return true', function (done) {
                    viewModel.canActivate('sectionId').then(function (result) {
                        expect(result).toEqual(true);
                        done();
                    });
                });
            });


            describe('and section does not exist', function () {

                beforeEach(function () {
                    getSectionById.reject();
                });

                it('should return redirect to 404', function (done) {
                    viewModel.canActivate('sectionId').then(function (result) {
                        expect(result).toEqual({ redirect: '404' });
                        done();
                    });
                });

            });

        });

        describe('when activated with 2 arguments', function () {

            describe('and section does not exist', function () {

                beforeEach(function () {
                    getSectionById.reject();
                    getCourseById.resolve({});
                });

                it('should return redirect to 404', function (done) {
                    viewModel.canActivate('courseId', 'sectionId').then(function (result) {
                        expect(result).toEqual({ redirect: '404' });
                        done();
                    });
                });

            });

            describe('and course does not exist', function () {

                beforeEach(function () {
                    getCourseById.reject();
                    getSectionById.resolve({});
                });

                it('should return redirect to 404', function (done) {
                    viewModel.canActivate('courseId', 'sectionId').then(function (result) {
                        expect(result).toEqual({ redirect: '404' });
                        done();
                    });
                });

            });

            describe('and both course and section exist', function () {

                beforeEach(function () {
                    getSectionById.resolve({});
                    getCourseById.resolve({});
                });

                it('should return true', function (done) {
                    viewModel.canActivate('courseId', 'sectionId').then(function (result) {
                        expect(result).toEqual(true);
                        done();
                    });
                });
            });

        });
    });

    describe('activate:', function () {

        var getById, getCourseDeferred;

        beforeEach(function () {
            viewModel.contextCourseTitle = null;
            viewModel.contextCourseId = null;

            getById = Q.defer();
            getCourseDeferred = Q.defer();
            spyOn(repository, 'getById').and.returnValue(getById.promise);
            spyOn(courseRepository, 'getById').and.returnValue(getCourseDeferred.promise);
            spyOn(clientContext, 'set');
            spyOn(clientContext, 'remove');
            userContext.identity = {};
        });

        it('should be a function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        describe('when activated with 1 argument', function () {

            it('should set sectionId', function (done) {
                viewModel.sectionId = null;
                getById.resolve(section);

                viewModel.activate('sectionId').then(function () {
                    expect(viewModel.sectionId).toEqual('sectionId');
                    done();
                });
            });

            it('should set null to coursId', function (done) {
                viewModel.courseId = 'courseId';
                getById.resolve(section);

                viewModel.activate('sectionId').then(function () {
                    expect(viewModel.courseId).toEqual(null);
                    done();
                });
            });

            it('should return promise', function () {
                expect(viewModel.activate('sectionId')).toBePromise();
            });

        });

        describe('when activated with 2 arguments', function () {

            it('should set sectionId', function (done) {
                viewModel.sectionId = null;
                getById.resolve(section);

                viewModel.activate('courseId', 'sectionId').then(function () {
                    expect(viewModel.sectionId).toEqual('sectionId');
                    done();
                });
            });

            it('should set courseId', function (done) {
                viewModel.courseId = null;
                getById.resolve(section);

                viewModel.activate('courseId', 'sectionId').then(function () {
                    expect(viewModel.courseId).toEqual('courseId');
                    done();
                });
            });

            it('should return promise', function () {
                expect(viewModel.activate('courseId', 'sectionId')).toBePromise();
            });

        });

        describe('when section does not exist', function () {

            beforeEach(function () {
                getById.reject('reason');
            });

            it('should reject promise', function (done) {
                var promise = viewModel.activate('sectionId', 'courseId');

                promise.catch(function () {
                    expect(promise).toBeRejectedWith('reason');
                    done();
                });
            });
        });

        describe('when section exists', function () {
            beforeEach(function () {
                getById.resolve(section);
            });

            it('should set section title', function (done) {
                viewModel.title('');

                var promise = viewModel.activate(section.id);

                promise.fin(function () {
                    expect(viewModel.title()).toBe(section.title);
                    done();
                });
            });

            it('should set image url', function (done) {
                viewModel.imageUrl('');

                var promise = viewModel.activate(section.id);

                promise.fin(function () {
                    expect(viewModel.imageUrl()).toBe(section.image);
                    done();
                });
            });

            it('should initialize questions collection', function (done) {
                viewModel.questions([]);
                var promise = viewModel.activate(section.id);

                promise.fin(function () {
                    expect(viewModel.questions().length).toBe(section.questions.length);
                    done();
                });
            });

            it('should sort questions asc', function (done) {
                var promise = viewModel.activate(section.id);

                promise.fin(function () {
                    expect(viewModel.questions).toBeSortedAsc('title');
                    done();
                });
            });

            it('should set currentLanguage', function (done) {
                viewModel.currentLanguage = null;
                viewModel.activate(section.id).then(function () {
                    expect(viewModel.currentLanguage).not.toBeNull();
                    done();
                });
            });

            it('should set isSectionTipVisible to false', function (done) {
                getById.resolve(section);
                viewModel.isSectionTipVisible(true);

                viewModel.activate(section.id).then(function () {
                    expect(viewModel.isSectionTipVisible()).toBeFalsy();
                    done();
                });
            });

            it('should set current sectionId to client context', function (done) {
                getById.resolve(section);
                viewModel.activate(section.id).then(function () {
                    expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVisitedSection, section.id);
                    done();
                });
            });

            it('should remove lastCreatedSection key from client context', function (done) {
                getById.resolve(section);
                viewModel.activate(section.id).then(function () {
                    expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedSectionId);
                    done();
                });
            });

            describe('when last created section is current section', function () {
                beforeEach(function () {
                    getById.resolve(section);
                    spyOn(clientContext, 'get').and.returnValue(section.id);
                });

                it('should set isLastCreatedSection to true', function (done) {
                    viewModel.activate(section.id).then(function () {
                        expect(viewModel.isLastCreatedSection).toBeTruthy();
                        done();
                    });
                });
            });

            describe('when last created section is not current section', function () {
                beforeEach(function () {
                    getById.resolve(section);
                    spyOn(clientContext, 'get').and.returnValue('some id');
                });

                it('should set isLastCreatedSection to true', function (done) {
                    viewModel.activate(section.id, null).fin(function () {
                        expect(viewModel.isLastCreatedSection).toBeFalsy();
                        done();
                    });
                });
            });
        });

    });

    describe('back:', function () {

        it('should be function', function () {
            expect(viewModel.back).toBeFunction();
        });

        describe('when courseId is set', function () {

            it('should redirect to course', function () {
                viewModel.courseId = 'courseId';
                viewModel.back();
                expect(router.navigate).toHaveBeenCalledWith('#courses/courseId');
            });

        });

        describe('when courseId is not set', function () {

            it('should redirect to sections', function () {
                viewModel.courseId = null;
                viewModel.back();
                expect(router.navigate).toHaveBeenCalledWith('#library/sections');
            });

        });

    });

    describe('title:', function () {

        it('should be observable', function () {
            expect(viewModel.title).toBeObservable();
        });

        describe('isEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.title.isEditing).toBeObservable();
            });

        });

        describe('isValid:', function () {

            it('should be computed', function () {
                expect(viewModel.title.isValid).toBeComputed();
            });

            describe('when title is empty', function () {

                it('should be false', function () {
                    viewModel.title('');
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

            });

            describe('when title is longer than 255', function () {

                it('should be false', function () {
                    viewModel.title(utils.createString(viewModel.titleMaxLength + 1));
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

            });

            describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                it('should be true', function () {
                    viewModel.title('   ' + utils.createString(viewModel.titleMaxLength - 1) + '   ');
                    expect(viewModel.title.isValid()).toBeTruthy();
                });

            });

            describe('when title is not empty and not longer than 255', function () {

                it('should be true', function () {
                    viewModel.title(utils.createString(viewModel.titleMaxLength - 1));
                    expect(viewModel.title.isValid()).toBeTruthy();
                });

            });
        });
    });

    describe('imageUrl:', function () {

        it('should be observable', function () {
            expect(viewModel.imageUrl).toBeObservable();
        });

    });

    describe('isSectionTipVisible', function () {
        it('should be observable', function () {
            expect(viewModel.isSectionTipVisible).toBeObservable();
        });
    });

    describe('showSectionTip', function () {
        it('should be function', function () {
            expect(viewModel.showSectionTip).toBeFunction();
        });

        it('should set \'isSectionTipVisible\' to true', function () {
            viewModel.isSectionTipVisible(false);
            viewModel.showSectionTip();
            expect(viewModel.isSectionTipVisible()).toBeTruthy();
        });

        it('should send event \'Expand \"Learning objective hint\"\'', function () {
            viewModel.showSectionTip();
            expect(eventTracker.publish).toHaveBeenCalledWith('Expand "Learning objective hint"');
        });
    });

    describe('hideSectionTip', function () {
        it('should be function', function () {
            expect(viewModel.hideSectionTip).toBeFunction();
        });

        it('should set \'isSectionTipVisible\' to false', function () {
            viewModel.isSectionTipVisible(true);
            viewModel.hideSectionTip();
            expect(viewModel.isSectionTipVisible()).toBeFalsy();
        });

        it('should send event \'Collapse \"Learning objective hint\"\'', function () {
            viewModel.hideSectionTip();
            expect(eventTracker.publish).toHaveBeenCalledWith('Collapse "Learning objective hint"');
        });
    });

    describe('isImageLoading:', function () {

        it('should be observable', function () {
            expect(viewModel.isImageLoading).toBeObservable();
        });

        it('should be false by default', function () {
            expect(viewModel.isImageLoading()).toBeFalsy();
        });

    });

    describe('titleMaxLength:', function () {

        it('should be defined', function () {
            expect(viewModel.titleMaxLength).toBeDefined();
        });

        it('should be 255', function () {
            expect(viewModel.titleMaxLength).toBe(255);
        });

    });

    describe('startEditTitle:', function () {

        it('should be function', function () {
            expect(viewModel.startEditTitle).toBeFunction();
        });

        it('should set title.isEditing to true', function () {
            viewModel.title.isEditing(false);
            viewModel.startEditTitle();
            expect(viewModel.title.isEditing()).toBeTruthy();
        });

    });

    describe('endEditTitle:', function () {

        var updateTitleDeferred, getByIdDeferred;

        beforeEach(function () {
            updateTitleDeferred = Q.defer();
            getByIdDeferred = Q.defer();

            spyOn(repository, 'updateTitle').and.returnValue(updateTitleDeferred.promise);
            spyOn(repository, 'getById').and.returnValue(getByIdDeferred.promise);

        });

        it('should be function', function () {
            expect(viewModel.endEditTitle).toBeFunction();
        });

        it('should set title.isEditing to false', function () {
            viewModel.title.isEditing(true);
            viewModel.endEditTitle();
            expect(viewModel.title.isEditing()).toBeFalsy();
        });

        it('should trim title', function () {
            viewModel.title('    Some title     ');
            viewModel.endEditTitle();
            expect(viewModel.title()).toEqual('Some title');
        });

        describe('when title is not modified', function () {
            var promise = null;
            beforeEach(function () {
                viewModel.title(section.title);
                promise = getByIdDeferred.promise.finally(function () { });
                getByIdDeferred.resolve(section);
            });

            it('should not send event', function (done) {
                viewModel.endEditTitle();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not show notification', function (done) {
                viewModel.endEditTitle();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    expect(notify.saved).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not update section in repository', function (done) {
                viewModel.endEditTitle();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    expect(repository.updateTitle).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when title is modified', function () {

            var getPromise = null, newTitle = section.title + 'test';
            beforeEach(function () {

                viewModel.title(newTitle);
                getPromise = getByIdDeferred.promise.finally(function () { });
                getByIdDeferred.resolve(section);
            });

            it('should send event \'Update objective title\'', function (done) {
                viewModel.endEditTitle();

                getPromise.fin(function () {
                    expect(getPromise).toBeResolved();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Update objective title');
                    done();
                });
            });

            describe('and when title is valid', function () {

                it('should update section title in repository', function (done) {
                    viewModel.endEditTitle();

                    getPromise.fin(function () {
                        expect(getPromise).toBeResolved();
                        expect(repository.updateTitle).toHaveBeenCalled();
                        expect(repository.updateTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                        done();
                    });
                });

                describe('and when section title updated successfully', function () {

                    it('should update notification', function (done) {
                        var promise = updateTitleDeferred.promise.fin(function () { });
                        updateTitleDeferred.resolve(new Date());

                        viewModel.endEditTitle();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

            describe('and when title is not valid', function () {

                it('should revert section title value', function (done) {
                    viewModel.title('');
                    viewModel.endEditTitle();

                    getPromise.fin(function () {
                        expect(viewModel.title()).toBe(section.title);
                        done();
                    });
                });

            });
        });
    });

    describe('updateImage:', () => {

        it(`should send event \'Open "change objective image" dialog\'`, () => {
            spyOn(uploadImage, 'execute').and.returnValue(Promise.resolve());
            viewModel.updateImage();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open "change objective image" dialog');
        });

        it('should start loading', () => {
            viewModel.isImageLoading(false);
            spyOn(uploadImage, 'execute').and.returnValue(Promise.resolve());
            viewModel.updateImage();
            expect(viewModel.isImageLoading()).toBeTruthy();
        });

        describe('when image uploading started', () => {

            describe('and when image uploading successfull', () => {

                let uploadImagePromise;
                let updateSectionImagePromise;
                let file;
                let imageUploadRes;
                let sectionUpdateImageRes;

                beforeEach(() => {
                    file = 'some image file';
                    imageUploadRes = {
                        id: 'someid',
                        title: 'title',
                        url: 'https://urla.com'
                    };
                    sectionUpdateImageRes = {
                        imageUrl: imageUploadRes.url
                    };
                    uploadImagePromise = Promise.resolve(imageUploadRes);
                    updateSectionImagePromise = Promise.resolve(sectionUpdateImageRes);
                    spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
                    spyOn(repository, 'updateImage').and.returnValue(updateSectionImagePromise);
                });

                it('should upload image to image storage', () => {
                    viewModel.updateImage(file);
                    expect(uploadImage.execute).toHaveBeenCalledWith(file);
                });

                it('should update section image on the server', done => (async () => {
                    viewModel.updateImage(file);
                    await uploadImagePromise;
                    expect(repository.updateImage).toHaveBeenCalledWith(viewModel.sectionId, imageUploadRes.url);
                })().then(done));

                it('should update section image', done => (async () => {
                    viewModel.updateImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(viewModel.imageUrl()).toBe(sectionUpdateImageRes.imageUrl);
                })().then(done));

                it('should show saved notification', done => (async () => {
                    viewModel.updateImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));

                it('should stop image uploading', done => (async () => {
                    viewModel.isImageLoading(true);
                    viewModel.updateImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(viewModel.isImageLoading()).toBeFalsy();
                })().then(done));
            });

        });

    });

    describe('navigateToEditQuestion:', function () {

        describe('when question is null', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.navigateToEditQuestion(null); };
                expect(f).toThrow();
            });

        });

        describe('when question is undefined', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.navigateToEditQuestion(); };
                expect(f).toThrow();
            });

        });

        describe('when question does not have property id', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.navigateToEditQuestion({}); };
                expect(f).toThrow();
            });

        });

        describe('when question id is null', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.navigateToEditQuestion({ id: null }); };
                expect(f).toThrow();
            });

        });

        describe('when course id is set', function () {

            it('should navigate to question within course context', function () {
                viewModel.courseId = 'courseId';
                viewModel.sectionId = section.id;

                viewModel.navigateToEditQuestion(section.questions[0]);

                expect(router.navigate).toHaveBeenCalledWith('#courses/courseId/sections/' + section.id + '/questions/' + section.questions[0].id);
            });

        });

        describe('when course id is not set', function () {

            it('should navigate to question within section context', function () {
                viewModel.courseId = null;
                viewModel.sectionId = section.id;

                viewModel.navigateToEditQuestion(section.questions[0]);

                expect(router.navigate).toHaveBeenCalledWith('#library/sections/' + section.id + '/questions/' + section.questions[0].id);
            });

        });

        it('should send event \"Navigate to question editor\"', function () {
            viewModel.sectionId = section.id;

            viewModel.navigateToEditQuestion(section.questions[0]);

            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to question editor');
        });

    });

    describe('deleteSelectedQuestions:', function () {

        var removeQuestions;

        beforeEach(function () {
            removeQuestions = Q.defer();
            spyOn(questionRepository, 'removeQuestions').and.returnValue(removeQuestions.promise);
        });

        it('should be a function', function () {
            expect(viewModel.deleteSelectedQuestions).toBeFunction();
        });

        it('should send event \'Delete question\'', function () {
            viewModel.questions([{ isSelected: ko.observable(true) }]);
            viewModel.deleteSelectedQuestions();
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete question');
        });

        describe('when no selected questions', function () {

            it('should throw exception', function () {
                viewModel.questions([]);
                var f = function () { viewModel.deleteSelectedQuestions(); };
                expect(f).toThrow();
            });

        });

        describe('when some questions are selected', function () {


            beforeEach(function () {
                viewModel.sectionId = 'sectionId';
                viewModel.questions([{ id: "SomeQuestionId1", isSelected: ko.observable(true) }, { id: "SomeQuestionId2", isSelected: ko.observable(true) }]);
            });

            it('should delete selected questions', function () {
                viewModel.deleteSelectedQuestions();

                expect(questionRepository.removeQuestions).toHaveBeenCalledWith('sectionId', ["SomeQuestionId1", "SomeQuestionId2"]);
            });

            describe('and when questions deleted successfully', function () {

                it('should delete selected questions from viewModel', function (done) {
                    removeQuestions.resolve();
                    viewModel.deleteSelectedQuestions();

                    removeQuestions.promise.finally(function () {
                        expect(viewModel.questions().length).toBe(0);
                        done();
                    });
                });

                it('should update notificaion', function (done) {
                    removeQuestions.resolve(new Date());
                    viewModel.deleteSelectedQuestions();

                    removeQuestions.promise.finally(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

    });

    describe('enableDeleteQuestions:', function () {

        it('should be observable', function () {
            expect(viewModel.enableDeleteQuestions).toBeObservable();
        });

        describe('when no question selected', function () {

            it('should be false', function () {
                viewModel.questions([]);
                expect(viewModel.enableDeleteQuestions()).toBe(false);
            });

        });

        describe('when question is selected', function () {

            it('should be true', function () {
                viewModel.questions([
                    { isSelected: ko.observable(true) }
                ]);

                expect(viewModel.enableDeleteQuestions()).toBe(true);
            });

        });

        describe('when few questions are selected', function () {

            it('should befalse', function () {
                viewModel.questions([
                    { isSelected: ko.observable(true) },
                    { isSelected: ko.observable(true) }
                ]);

                expect(viewModel.enableDeleteQuestions()).toBe(true);
            });

        });
    });

    describe('toggleQuestionSelection:', function () {

        it('should be a function', function () {
            expect(viewModel.toggleQuestionSelection).toBeFunction();
        });

        describe('when question is null', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.toggleQuestionSelection(null); };
                expect(f).toThrow();
            });

        });

        describe('when question is undefined', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.toggleQuestionSelection(); };
                expect(f).toThrow();
            });

        });

        describe('when question does not have isSelected() observable', function () {

            it('should throw exception', function () {
                var f = function () { viewModel.toggleQuestionSelection({}); };
                expect(f).toThrow();
            });

        });

        describe('when question is not selected', function () {

            it('should send event \'Select question\'', function () {
                viewModel.toggleQuestionSelection({ isSelected: ko.observable(false) });
                expect(eventTracker.publish).toHaveBeenCalledWith('Select question');
            });

            it('should set question.isSelected to true', function () {
                var question = { isSelected: ko.observable(false) };
                viewModel.toggleQuestionSelection(question);
                expect(question.isSelected()).toBeTruthy();
            });

        });

        describe('when question is selected', function () {

            it('should send event \'Unselect question\'', function () {
                viewModel.toggleQuestionSelection({ isSelected: ko.observable(true) });
                expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question');
            });

            it('should set question.isSelected to false', function () {
                var question = { isSelected: ko.observable(true) };
                viewModel.toggleQuestionSelection(question);
                expect(question.isSelected()).toBeFalsy();
            });

        });
    });

    describe('questions:', function () {

        it('should be observable', function () {
            expect(viewModel.questions).toBeObservable();
        });

    });

    describe('currentLanguage:', function () {

        it('should be defined', function () {
            expect(viewModel.currentLanguage).toBeDefined();
        });

    });

    describe('navigateToCourseEvent:', function () {

        it('should be function', function () {
            expect(viewModel.navigateToCourseEvent).toBeFunction();
        });

        it('should send event \'Navigate to course details\'', function () {
            viewModel.navigateToCourseEvent();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course details');
        });

    });

    describe('navigateToSectionsEvent:', function () {

        it('should be function', function () {
            expect(viewModel.navigateToSectionsEvent).toBeFunction();
        });

        it('should send event \'Navigate to objectives\'', function () {
            viewModel.navigateToSectionsEvent();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives');
        });

    });

    describe('isSortingEnabled:', function () {

        it('should be computed', function () {
            expect(viewModel.isSortingEnabled).toBeComputed();
        });

        describe('when questions count is 0', function () {

            it('should be falsy', function () {
                viewModel.questions([]);

                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });

        });

        describe('when questions count is 1', function () {

            it('should be falsy', function () {
                viewModel.questions([{ isSelected: ko.observable(false) }]);

                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });

        });

        describe('when questions count is more than 1', function () {

            it('should be truthy', function () {
                viewModel.questions([
                    { isSelected: ko.observable(false) },
                    { isSelected: ko.observable(false) }
                ]);

                expect(viewModel.isSortingEnabled()).toBeTruthy();
            });

        });

    });

    describe('isQuestionsListReorderedByCollaborator:', function () {

        it('should be observable', function () {
            expect(viewModel.isQuestionsListReorderedByCollaborator).toBeObservable();
        });

    });

    describe('updateQuestionsOrder:', function () {

        it('should be a function', function () {
            expect(viewModel.updateQuestionsOrder).toBeFunction();
        });

        it('should set isReorderingQuestions to false', function () {
            spyOn(repository, 'updateQuestionsOrder').and.returnValue(Q.defer().promise);
            viewModel.isReorderingQuestions(true);
            viewModel.updateQuestionsOrder();
            expect(viewModel.isReorderingQuestions()).toBeFalsy();
        });

        it('should send event \'Change order of questions\'', function () {
            spyOn(repository, 'updateQuestionsOrder').and.returnValue(Q.defer().promise);

            viewModel.updateQuestionsOrder();

            expect(eventTracker.publish).toHaveBeenCalledWith('Change order of questions');
        });

        it('should update questions order', function () {
            spyOn(repository, 'updateQuestionsOrder').and.returnValue(Q.defer().promise);

            var questions = [{ isSelected: ko.observable(false) }];
            viewModel.questions(questions);
            viewModel.sectionId = section.id;

            viewModel.updateQuestionsOrder();

            expect(repository.updateQuestionsOrder).toHaveBeenCalledWith(section.id, questions);
        });

        describe('when update questions order is succeed', function () {

            it('should notify saved', function (done) {
                var deferred = Q.defer();
                deferred.resolve();
                spyOn(repository, 'updateQuestionsOrder').and.returnValue(deferred.promise);

                viewModel.updateQuestionsOrder();

                deferred.promise.finally(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

        });

        describe('when update questions order is failed', function () {

            it('should not notify saved', function (done) {
                var deferred = Q.defer();
                deferred.reject();
                spyOn(repository, 'updateQuestionsOrder').and.returnValue(deferred.promise);

                viewModel.updateQuestionsOrder();

                deferred.promise.finally(function () {
                    expect(notify.saved).not.toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('sectionTitleUpdated:', function () {

        it('should be function', function () {
            expect(viewModel.sectionTitleUpdated).toBeFunction();
        });

        describe('when section is current section', function () {

            describe('when section title is editing', function () {
                beforeEach(function () {
                    viewModel.title.isEditing(true);
                });

                it('should not update section title', function () {
                    viewModel.sectionId = section.id;
                    viewModel.title('');
                    viewModel.sectionTitleUpdated(section);

                    expect(viewModel.title()).toBe('');
                });
            });

            describe('when section title is not editing', function () {
                beforeEach(function () {
                    viewModel.title.isEditing(false);
                });

                it('should update section title', function () {
                    viewModel.sectionId = section.id;
                    viewModel.title('');
                    viewModel.sectionTitleUpdated(section);

                    expect(viewModel.title()).toBe(section.title);
                });
            });
        });

        describe('when section is not current section', function () {
            it('should not update section title', function () {
                viewModel.sectionId = 'qwe';
                viewModel.title('');
                viewModel.sectionTitleUpdated(section);

                expect(viewModel.title()).toBe('');
            });
        });

    });

    describe('sectionImageUrlUpdated:', function () {

        it('should be function', function () {
            expect(viewModel.sectionImageUrlUpdated).toBeFunction();
        });

        describe('when section is current section', function () {

            beforeEach(function () {
                viewModel.sectionId = section.id;
            });

            it('should update section image url', function () {
                viewModel.imageUrl('');
                viewModel.sectionImageUrlUpdated(section);
                expect(viewModel.imageUrl()).toBe(section.image);
            });
        });

        describe('when section is not current section', function () {

            beforeEach(function () {
                viewModel.sectionId = 'some_another_id';
            });

            it('should not update section image url', function () {
                viewModel.imageUrl('');
                viewModel.sectionImageUrlUpdated(section);
                expect(viewModel.imageUrl()).toBe('');
            });

        });

    });

    describe('isReorderingQuestions:', function () {

        it('should be observable', function () {
            expect(viewModel.isReorderingQuestions).toBeObservable();
        });
    });

    describe('startReorderingQuestions:', function () {

        it('should be function', function () {
            expect(viewModel.startReorderingQuestions).toBeFunction();
        });

        it('should set isReorderingQuestion', function () {
            viewModel.isReorderingQuestions(false);
            viewModel.startReorderingQuestions();

            expect(viewModel.isReorderingQuestions()).toBeTruthy();
        });
    });

    describe('endReorderingQuestions:', function () {

        var getById;

        beforeEach(function () {
            getById = Q.defer();
            spyOn(repository, 'getById').and.returnValue(getById.promise);
        });

        it('should be function', function () {
            expect(viewModel.endReorderingQuestions).toBeFunction();
        });

        describe('when reordering questions has been finished', function () {
            beforeEach(function () {
                viewModel.isReorderingQuestions(false);
            });

            it('should resolve promise', function (done) {
                var promise = viewModel.endReorderingQuestions();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });
            });
        });

        describe('when questions have not been reordered by collaborator', function () {
            beforeEach(function () {
                viewModel.isReorderingQuestions(true);
                viewModel.isQuestionsListReorderedByCollaborator(false);
            });

            it('should resolve promise', function (done) {
                var promise = viewModel.endReorderingQuestions();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });
            });

            it('should set isReorderingQuestions to false', function (done) {
                viewModel.isReorderingQuestions(true);
                var promise = viewModel.endReorderingQuestions();

                promise.fin(function () {
                    expect(viewModel.isReorderingQuestions()).toBeFalsy();
                    done();
                });
            });
        });

        describe('when questions have been reordered by collaborator', function () {
            var questions = [
                            { id: 3, title: 'A', isSelected: ko.observable(false) },
                            { id: 1, title: 'b', isSelected: ko.observable(false) }
            ];

            beforeEach(function () {
                viewModel.questions([questions[1], questions[0]]);
            });

            beforeEach(function () {
                viewModel.isReorderingQuestions(true);
                viewModel.isQuestionsListReorderedByCollaborator(true);
                getById.resolve({ questions: questions });
            });

            it('should set isReorderingSections to false', function (done) {
                viewModel.isReorderingQuestions(true);
                var promise = viewModel.endReorderingQuestions();

                promise.fin(function () {
                    expect(viewModel.isReorderingQuestions()).toBeFalsy();
                    done();
                });
            });

            it('should set isQuestionsListReorderedByCollaborator to false', function (done) {
                viewModel.isReorderingQuestions(true);
                var promise = viewModel.endReorderingQuestions();

                promise.fin(function () {
                    expect(viewModel.isQuestionsListReorderedByCollaborator()).toBeFalsy();
                    done();
                });
            });

            it('should reorder questions', function (done) {
                var promise = viewModel.endReorderingQuestions();

                promise.fin(function () {
                    expect(viewModel.questions()[0].id).toBe(questions[0].id);
                    expect(viewModel.questions()[1].id).toBe(questions[1].id);
                    done();
                });
            });
        });

    });

    describe('questionsReordered:', function () {
        beforeEach(function () {
            var questions = [
                        { id: 3, title: 'A', isSelected: ko.observable(false) },
                        { id: 1, title: 'b', isSelected: ko.observable(false) },
                        { id: 2, title: 'B', isSelected: ko.observable(false) },
                        { id: 0, title: 'a', isSelected: ko.observable(false) }
            ];
            viewModel.questions(questions);
        });

        it('should be function', function () {
            expect(viewModel.questionsReordered).toBeFunction();
        });

        describe('when section id corresponds current section', function () {

            beforeEach(function () {
                viewModel.sectionId = section.id;
            });

            describe('and isReorderingQuestions is false', function () {

                beforeEach(function () {
                    viewModel.isReorderingQuestions(false);
                });

                it('should update order of questions', function () {
                    viewModel.questionsReordered(section);

                    expect(viewModel.questions()[0].id).toBe(0);
                    expect(viewModel.questions()[3].id).toBe(3);
                });
            });

            describe('and isReorderingQuestions is true', function () {
                beforeEach(function () {
                    viewModel.isReorderingQuestions(true);
                });

                it('should set isQuestionsListReorderedByCollaborator to true', function () {
                    viewModel.isQuestionsListReorderedByCollaborator(false);
                    viewModel.questionsReordered(section);

                    expect(viewModel.isQuestionsListReorderedByCollaborator()).toBeTruthy();
                });

                it('should not update order of questions', function () {
                    viewModel.questionsReordered(section);

                    expect(viewModel.questions()[0].id).toBe(3);
                    expect(viewModel.questions()[3].id).toBe(0);
                });
            });
        });

        describe('when section id doesn\'t correspond current section', function () {

            beforeEach(function () {
                viewModel.sectionId = 'someId';
            });

            it('should not update order of questions', function () {
                viewModel.questionsReordered(section);

                expect(viewModel.questions()[0].id).toBe(3);
                expect(viewModel.questions()[3].id).toBe(0);
            });
        });
    });

    describe('questionCreatedByCollaborator:', function () {

        var question = { id: 'questionId', type: 'multipleSelect' };

        it('should be function', function () {
            expect(viewModel.questionCreatedByCollaborator).toBeFunction();
        });

        describe('when section id corresponds current section', function () {
            beforeEach(function () {
                viewModel.sectionId = section.id;
            });

            it('should add new question to questions list', function () {
                viewModel.questions([]);
                viewModel.questionCreatedByCollaborator(section.id, question);

                expect(viewModel.questions().length).toBe(1);
                expect(viewModel.questions()[0].id).toBe(question.id);
            });
        });

        describe('when section id doesn\'t correspond current section', function () {
            beforeEach(function () {
                viewModel.sectionId = 'someId';
            });

            it('should not add new question to questions list', function () {
                viewModel.questions([]);
                viewModel.questionCreatedByCollaborator(section.id, question);

                expect(viewModel.questions().length).toBe(0);
            });
        });
    });

    describe('questionDeletedByCollaborator:', function () {
        beforeEach(function () {
            var questions = [
                { id: '0', title: 'A', isSelected: ko.observable(false) },
                { id: '1', title: 'b', isSelected: ko.observable(false) },
                { id: '2', title: 'B', isSelected: ko.observable(false) },
                { id: '3', title: 'a', isSelected: ko.observable(false) }];
            viewModel.questions(questions);
        });

        it('should be function', function () {
            expect(viewModel.questionDeletedByCollaborator).toBeFunction();
        });

        describe('when section id corresponds current section', function () {
            beforeEach(function () {
                viewModel.sectionId = section.id;
            });

            it('should remove questions from section', function () {
                viewModel.questionDeletedByCollaborator(section.id, ['2', '3']);

                expect(viewModel.questions().length).toBe(2);
                expect(viewModel.questions()[0].id).toBe('0');
                expect(viewModel.questions()[1].id).toBe('1');
            });
        });

        describe('when section id doesn\'t correspond current section', function () {
            beforeEach(function () {
                viewModel.sectionId = 'someId';
            });

            it('should not remove questions from section', function () {
                viewModel.questionDeletedByCollaborator(section.id, ['2', '3']);

                expect(viewModel.questions().length).toBe(4);
            });
        });
    });

    describe('questionTitleUpdatedByCollaborator:', function () {
        it('should be function', function () {
            expect(viewModel.questionTitleUpdatedByCollaborator).toBeFunction();
        });

        var question = { id: 'id', title: 'title', modifiedOn: new Date() },
            vmQuestion = { id: question.id, title: ko.observable(''), modifiedOn: ko.observable(''), isSelected: ko.observable(false) };

        it('should update question title', function () {
            viewModel.questions([vmQuestion]);
            viewModel.questionTitleUpdatedByCollaborator(question);
            expect(vmQuestion.title()).toBe(question.title);
        });

        it('should update question modifiedOn', function () {
            viewModel.questions([vmQuestion]);
            viewModel.questionTitleUpdatedByCollaborator(question);
            expect(vmQuestion.modifiedOn()).toBe(question.modifiedOn);
        });
    });

    describe('questionUpdated:', function () {
        it('should be function', function () {
            expect(viewModel.questionUpdated).toBeFunction();
        });

        var question = { id: 'id', title: 'title', modifiedOn: new Date() },
            vmQuestion = { id: question.id, title: ko.observable(''), modifiedOn: ko.observable(''), isSelected: ko.observable(false) };

        it('should update question modifiedOn', function () {
            viewModel.questions([vmQuestion]);
            viewModel.questionUpdated(question);
            expect(vmQuestion.modifiedOn()).toBe(question.modifiedOn);
        });
    });
});
