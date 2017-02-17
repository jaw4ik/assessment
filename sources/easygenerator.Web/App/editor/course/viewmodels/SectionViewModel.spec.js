import SectionViewModel from './SectionViewModel';

import ko from 'knockout';
import constants from 'constants';
import moment from 'moment';
import uploadImage from 'images/commands/upload';
import eventTracker from 'eventTracker';
import sectionRepository from 'repositories/sectionRepository';
import updateSectionTitleCommand from '../commands/updateSectionTitleCommand';
import notify from 'notify';
import QuestionViewModel from './QuestionViewModel';
import updateSectionLearningObjectiveCommand from '../commands/updateSectionLearningObjectiveCommand';
import localizationManager from 'localization/localizationManager';

var eventCategory = 'Course editor (drag and drop)';

var events = {
    updateTitle: 'Update objective title',
    defineLearningOjective: 'Define learning objective for a section',
    openChangeObjectiveImageDialog: 'Open "change objective image" dialog'
};

describe('[SectionViewModel]', () => {
    let sectionViewModel;
    let courseId;
    let section;
    let isProcessing;
    let isExpanded;

    beforeEach(() => {
        courseId = 'courseId';
        section = {
            id: 'sectionId',
            title: 'sectionTitle',
            image: 'imageUrl',
            modifiedOn: new Date(),
            questions: [],
            learningObjective: 'learningObjective'
        };
        isProcessing = false;
        isExpanded = true;
        sectionViewModel = new SectionViewModel(courseId, section, isProcessing, false, isExpanded);
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(localizationManager, 'localize').and.returnValue('localized');
    });

    it('should initialize fields', () => {
        expect(sectionViewModel.courseId).toBe(courseId);
        expect(sectionViewModel.id()).toBe(section.id);
        expect(sectionViewModel.title()).toBe(section.title);
        expect(sectionViewModel.title.isEditing()).toBeFalsy();
        expect(sectionViewModel.title.maxLength).toBe(constants.validation.sectionTitleMaxLength);
        expect(sectionViewModel.originalTitle).toBe(section.title);
        expect(sectionViewModel.learningObjective()).toBe(section.learningObjective);
        expect(sectionViewModel.learningObjective.isEditing()).toBeFalsy();
        expect(sectionViewModel.learningObjective.maxLength).toBe(constants.validation.sectionTitleMaxLength);
        expect(sectionViewModel.originalLearningObjective).toBe(section.learningObjective);
        expect(sectionViewModel.modifiedOn()).toBe(moment(section.modifiedOn).format('DD/MM/YY'));
        expect(sectionViewModel.image()).toBe(section.image);
        expect(sectionViewModel.imageLoading()).toBeFalsy();
        expect(sectionViewModel.menuExpanded()).toBeFalsy();
        expect(sectionViewModel.questionsExpanded()).toBe(isExpanded);
        expect(sectionViewModel.questions()).toBeArray();
        expect(sectionViewModel.notContainQuestions()).toBe(section.questions.length === 0);
        expect(sectionViewModel.isProcessing()).toBe(isProcessing);
        expect(sectionViewModel.startEditingTitle).toBeFunction();
        expect(sectionViewModel.stopEditingTitle).toBeFunction();
        expect(sectionViewModel.updateFields).toBeFunction();
        expect(sectionViewModel.startEditingLearningObjective).toBeFunction();
        expect(sectionViewModel.stopEditingLearningObjective).toBeFunction();
        expect(sectionViewModel.toggleLearningObjectiveVisibility).toBeFunction();
        expect(sectionViewModel.toggleMenu).toBeFunction();
        expect(sectionViewModel.toggleQuestions).toBeFunction();
        expect(sectionViewModel.updateImage).toBeFunction();
        expect(sectionViewModel.deleteQuestion).toBeFunction();
        expect(sectionViewModel.addQuestion).toBeFunction();
    });

    describe('startEditingTitle:', () => {

        it('should start edit title', () => {
            sectionViewModel.title.isEditing(false);
            sectionViewModel.startEditingTitle();
            expect(sectionViewModel.title.isEditing()).toBeTruthy();
        });

    });

    describe('stopEditingTitle:', () => {

        it('should stop edit title', () => {
            sectionViewModel.title.isEditing(true);
            sectionViewModel.stopEditingTitle();
            expect(sectionViewModel.title.isEditing()).toBeFalsy();
        });

        it(`should send event ${events.updateTitle}`, () => {
            sectionViewModel.stopEditingTitle();
            expect(eventTracker.publish).toHaveBeenCalledWith(events.updateTitle, eventCategory);
        });

        describe('when title is not valid', () => {

            it('should return previous title', () => {
                sectionViewModel.title('Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title ');
                sectionViewModel.stopEditingTitle();
                expect(sectionViewModel.title()).toBe(sectionViewModel.originalTitle);
            });

        });

        describe('when title is valid', () => {

            beforeEach(() => {
                spyOn(updateSectionTitleCommand, 'execute');
            });

            it('should call update title command', () => {
                sectionViewModel.title('new section title');
                sectionViewModel.stopEditingTitle();
                expect(updateSectionTitleCommand.execute).toHaveBeenCalledWith(sectionViewModel.id(), sectionViewModel.title());
            });

            it('should update originalTitle', done => (async () => {
                sectionViewModel.title('new section title');
                sectionViewModel.originalTitle = 'das';
                await sectionViewModel.stopEditingTitle();
                expect(sectionViewModel.originalTitle).toBe(sectionViewModel.title());
            })().then(done));

            it('should call notify saved', done => (async () => {
                sectionViewModel.title('new section title');
                await sectionViewModel.stopEditingTitle();
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

        });

    });

    describe('startEditingLearningObjective:', () => {
        
        it('should start edit learningObjective', () => {
            sectionViewModel.learningObjective.isEditing(false);
            sectionViewModel.startEditingLearningObjective();
            expect(sectionViewModel.learningObjective.isEditing()).toBeTruthy();
        });

    });

    describe('stopEditingLearningObjective:', () => {
        
        it('should stop edit learningObjective', () => {
            sectionViewModel.learningObjective.isEditing(true);
            sectionViewModel.stopEditingLearningObjective();
            expect(sectionViewModel.learningObjective.isEditing()).toBeFalsy();
        });

        it(`should send event ${events.defineLearningOjective}`, () => {
            sectionViewModel.stopEditingLearningObjective();
            expect(eventTracker.publish).toHaveBeenCalledWith(events.defineLearningOjective, eventCategory);
        });

        describe('when learningObjective is not valid', () => {

            it('should return previous learningObjective', () => {
                sectionViewModel.learningObjective('Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title Test title ');
                sectionViewModel.stopEditingLearningObjective();
                expect(sectionViewModel.learningObjective()).toBe(sectionViewModel.originalLearningObjective);
            });

        });

        describe('when learningObjective is valid', () => {

            beforeEach(() => {
                spyOn(updateSectionLearningObjectiveCommand, 'execute');
            });

            it('should call update title command', () => {
                sectionViewModel.learningObjective('new section title');
                sectionViewModel.stopEditingLearningObjective();
                expect(updateSectionLearningObjectiveCommand.execute).toHaveBeenCalledWith(sectionViewModel.id(), sectionViewModel.learningObjective());
            });

            it('should update originalLearningObjective', done => (async () => {
                sectionViewModel.learningObjective('new section title');
                sectionViewModel.originalLearningObjective = 'das';
                await sectionViewModel.stopEditingLearningObjective();
                expect(sectionViewModel.originalLearningObjective).toBe(sectionViewModel.learningObjective());
            })().then(done));

            it('should call notify saved', done => (async () => {
                sectionViewModel.learningObjective('new section title');
                await sectionViewModel.stopEditingLearningObjective();
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

        });

    });

    describe('updateFields:', () => {

        it('should update section viewModel', () => {
            let newSection = {
                id: 'newsectionId',
                title: 'newsectionTitle',
                image: 'newimageUrl',
                createdBy: 'user',
                modifiedOn: new Date(),
                questions: [],
                learningObjective: ''
            };
            sectionViewModel.updateFields(newSection);
            expect(sectionViewModel.id()).toBe(newSection.id);
            expect(sectionViewModel.title()).toBe(newSection.title);
            expect(sectionViewModel.createdBy).toBe(newSection.createdBy);
            expect(sectionViewModel.originalTitle).toBe(newSection.title);
            expect(sectionViewModel.modifiedOn()).toBe(moment(newSection.modifiedOn).format('DD/MM/YY'));
            expect(sectionViewModel.image()).toBe(newSection.image);
        });

    });

    describe('toggleMenu:', () => {

        describe('when menu shown', () => {

            it('should hide menu', () => {
                sectionViewModel.menuExpanded(true);
                sectionViewModel.toggleMenu();
                expect(sectionViewModel.menuExpanded()).toBeFalsy();
            });

        });

        describe('when menu hidden', () => {

            it('should show menu', () => {
                sectionViewModel.menuExpanded(false);
                sectionViewModel.toggleMenu();
                expect(sectionViewModel.menuExpanded()).toBeTruthy();
            });

        });

    });

    describe('toggleQuestions:', () => {

        describe('when questions shown', () => {

            it('should hide questions', () => {
                sectionViewModel.questionsExpanded(true);
                sectionViewModel.toggleQuestions();
                expect(sectionViewModel.questionsExpanded()).toBeFalsy();
            });

        });

        describe('when questions hidden', () => {

            it('should show questions', () => {
                sectionViewModel.questionsExpanded(false);
                sectionViewModel.toggleQuestions();
                expect(sectionViewModel.questionsExpanded()).toBeTruthy();
            });

        });

    });

    describe('updateImage:', () => {

        it(`should send event ${events.openChangeObjectiveImageDialog}`, () => {
            spyOn(uploadImage, 'execute');
            sectionViewModel.updateImage();
            expect(eventTracker.publish).toHaveBeenCalledWith(events.openChangeObjectiveImageDialog, eventCategory);
        });

        it('should start loading', () => {
            sectionViewModel.imageLoading(false);
            spyOn(uploadImage, 'execute');
            sectionViewModel.updateImage();
            expect(sectionViewModel.imageLoading()).toBeTruthy();
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
                    spyOn(sectionRepository, 'updateImage').and.returnValue(updateSectionImagePromise);
                });

                it('should upload image to image storage', () => {
                    sectionViewModel.updateImage(file);
                    expect(uploadImage.execute).toHaveBeenCalledWith(file);
                });

                it('should update section image on the server', done => (async () => {
                    sectionViewModel.updateImage(file);
                    await uploadImagePromise;
                    expect(sectionRepository.updateImage).toHaveBeenCalledWith(sectionViewModel.id(), imageUploadRes.url);
                })().then(done));

                it('should update section image', done => (async () => {
                    sectionViewModel.updateImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(sectionViewModel.image()).toBe(sectionUpdateImageRes.imageUrl);
                })().then(done));

                it('should show saved notification', done => (async () => {
                    sectionViewModel.updateImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));

                it('should stop image uploading', done => (async () => {
                    sectionViewModel.imageLoading(true);
                    sectionViewModel.updateImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(sectionViewModel.imageLoading()).toBeFalsy();
                })().then(done));
            });

            describe('and when image uploading failed', () => {
                
                let uploadImagePromise;
                let updateSectionImagePromise;
                let file;
                let reason;

                beforeEach(() => {
                    file = 'some image file';
                    reason = 'some reject reason';
                    uploadImagePromise = Promise.reject(reason);
                    updateSectionImagePromise = Promise.resolve();
                    spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
                    spyOn(sectionRepository, 'updateImage').and.returnValue(updateSectionImagePromise);
                });

                it('should show notify error message', done => (async () => {
                    try {
                        sectionViewModel.updateImage(file);
                        await uploadImagePromise;
                        await updateSectionImagePromise;
                    } catch (e) {
                        expect(notify.error).toHaveBeenCalledWith(reason);
                        expect(e).toBe(reason);
                    } 
                })().then(done));

                it('should stop image uploading', done => (async () => {
                    try {
                        sectionViewModel.imageLoading(true);
                        sectionViewModel.updateImage(file);
                        await uploadImagePromise;
                        await updateSectionImagePromise;
                    } catch (e) {
                        expect(sectionViewModel.imageLoading()).toBeFalsy();
                        expect(e).toBe(reason);
                    } 
                })().then(done));

            });

        });

    });

    describe('deleteQuestion:', () => {

        describe('when question contain questionToDelete', () => {

            it('should delete question', () => {
                let question = {
                    id: '1'
                };
                sectionViewModel.questions.push(question);
                sectionViewModel.deleteQuestion(question);
                expect(sectionViewModel.questions().length).toBe(0);
            });

        });

    });

    describe('addQuestion:', () => {

        describe('when question is not an object', () => {

            it('should do nothing', () => {
                let result = sectionViewModel.addQuestion();
                expect(result).toBe(undefined);

            });

        });

        describe('when question is empty object', () => {

            it('should create empty question viewModel', () => {
                let result = sectionViewModel.addQuestion({});
                expect(result).toBeInstanceOf(QuestionViewModel);
                expect(result.id()).toBe('');
            });

        });

        describe('when question is instance of QuestionViewModel', () => {

            it('should return this question with new section id', () => {
                let question = new QuestionViewModel('courseId', 'previousSectionId', {});
                let result = sectionViewModel.addQuestion(question);
                expect(result.sectionId).toBe(sectionViewModel.id());
            });

        });

        describe('when question is not an empty object and not an instace of QuestionViewModel', () => {

            it('should create not empty question viewModel', () => {
                let question = {
                    id: 'id',
                    title: 'title',
                    type: 'type'
                };
                let result = sectionViewModel.addQuestion(question);
                expect(result).toBeInstanceOf(QuestionViewModel);
                expect(result.id()).toBe(question.id);
            });

        });

        describe('when next question id is defined', () => {

            describe('and next question exists', () => {
                it('should push question before next question', () => {
                    sectionViewModel.questions.push({ id: ko.observable('0') });
                    sectionViewModel.questions.push({ id: ko.observable('1') });
                    let question = {
                        id: 'id',
                        title: 'title',
                        type: 'type'
                    };
                    let result = sectionViewModel.addQuestion(question, '1');
                    expect(sectionViewModel.questions.indexOf(result)).toBe(1);
                });    
            });

            it('should push question to the end', () => {
                sectionViewModel.questions.push({ id: ko.observable('0') });
                sectionViewModel.questions.push({ id: ko.observable('1') });
                let question = {
                    id: 'id',
                    title: 'title',
                    type: 'type'
                };
                let result = sectionViewModel.addQuestion(question, 'next');
                expect(sectionViewModel.questions.indexOf(result)).toBe(2);
            });
        });

        describe('when next question id is undefined', () => {
           
            it('should push question to end', () => {
                sectionViewModel.questions.push({ id: ko.observable('0') });
                sectionViewModel.questions.push({ id: ko.observable('1') });
                let question = {
                    id: 'id',
                    title: 'title',
                    type: 'type'
                };
                let result = sectionViewModel.addQuestion(question);
                expect(sectionViewModel.questions.indexOf(result)).toBe(2);
            });

        });

    });
});