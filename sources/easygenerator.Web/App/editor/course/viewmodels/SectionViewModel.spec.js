import SectionViewModel from './SectionViewModel';
import constants from 'constants';
import moment from 'moment';
import imageUpload from 'imageUpload';
import eventTracker from 'eventTracker';
import sectionRepository from 'repositories/objectiveRepository';
import updateSectionTitleCommand from '../commands/updateSectionTitleCommand';
import notify from 'notify';
import QuestionViewModel from './QuestionViewModel';

var eventCategory = 'Course editor (drag and drop)';

var events = {
    updateTitle: 'Update objective title',
    openChangeObjectiveImageDialog: 'Open "change objective image" dialog'
};

describe('[SectionViewModel]', () => {
    let sectionViewModel;
    let courseId;
    let section;
    let isProcessed;

    beforeEach(() => {
        courseId = 'courseId';
        section = {
            id: 'sectionId',
            title: 'sectionTitle',
            image: 'imageUrl',
            modifiedOn: new Date(),
            questions: []
        };
        isProcessed = false;
        sectionViewModel = new SectionViewModel(courseId, section, isProcessed);
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
    });

    it('should initialize fields', () => {
        expect(sectionViewModel.courseId).toBe(courseId);
        expect(sectionViewModel.id()).toBe(section.id);
        expect(sectionViewModel.title()).toBe(section.title);
        expect(sectionViewModel.title.isEditing()).toBeFalsy();
        expect(sectionViewModel.title.maxLength).toBe(constants.validation.objectiveTitleMaxLength);
        expect(sectionViewModel.originalTitle).toBe(section.title);
        expect(sectionViewModel.modifiedOn()).toBe(moment(section.modifiedOn).format('DD/MM/YY'));
        expect(sectionViewModel.image()).toBe(section.image);
        expect(sectionViewModel.imageLoading()).toBeFalsy();
        expect(sectionViewModel.menuExpanded()).toBeFalsy();
        expect(sectionViewModel.questionsExpanded()).toBe(!isProcessed);
        expect(sectionViewModel.questions()).toBeArray();
        expect(sectionViewModel.notContainQuestions()).toBe(section.questions.length === 0);
        expect(sectionViewModel.isProcessed()).toBe(isProcessed);
        expect(sectionViewModel.startEditingTitle).toBeFunction();
        expect(sectionViewModel.stopEditingTitle).toBeFunction();
        expect(sectionViewModel.updateFields).toBeFunction();
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

    describe('updateFields:', () => {

        it('should update section viewModel', () => {
            let newSection = {
                id: 'newsectionId',
                title: 'newsectionTitle',
                image: 'newimageUrl',
                modifiedOn: new Date(),
                questions: []
            };
            sectionViewModel.updateFields(newSection);
            expect(sectionViewModel.id()).toBe(newSection.id);
            expect(sectionViewModel.title()).toBe(newSection.title);
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
            sectionViewModel.updateImage();
            expect(eventTracker.publish).toHaveBeenCalledWith(events.openChangeObjectiveImageDialog, eventCategory);
        });

        it('should upload image', () => {
            spyOn(imageUpload, 'upload');
            sectionViewModel.updateImage();
            expect(imageUpload.upload).toHaveBeenCalled();
        });

        describe('when image loading started', () => {

            beforeEach(() => {
                spyOn(imageUpload, 'upload').and.callFake(spec => spec.startLoading());
            });

            it('should set start upload image', () => {
                sectionViewModel.imageLoading(false);
                sectionViewModel.updateImage();
                expect(sectionViewModel.imageLoading()).toBeTruthy();
            });

        });

        describe('when image was uploaded', () => {

            let url = 'http://urlka.com';
            let newUrl = 'new/image/url';
            let promise;
            let date;

            beforeEach(() => {
                spyOn(imageUpload, 'upload').and.callFake(spec => {
                    spec.success(url);
                });

                date = new Date();

                promise = Promise.resolve({
                    modifiedOn: date,
                    imageUrl: newUrl
                });

                spyOn(sectionRepository, 'updateImage').and.returnValue(promise);
            });

            it('should update objective image', () => {
                sectionViewModel.updateImage();
                expect(sectionRepository.updateImage).toHaveBeenCalledWith(sectionViewModel.id(), url);
            });

            describe('and when objective image updated successfully', () => {

                it('should update image', done => (async () => {
                    sectionViewModel.image('');
                    sectionViewModel.updateImage();
                    await promise;
                    expect(sectionViewModel.image()).toBe(newUrl);
                })().then(done));

                it('should update modifiedOn', done => (async () => {
                    sectionViewModel.updateImage();
                    await promise;
                    expect(sectionViewModel.modifiedOn()).toBe(moment(date).format('DD/MM/YY'));
                })().then(done));

                it('should stop image loading', done => (async () => {
                    sectionViewModel.imageLoading(true);
                    sectionViewModel.updateImage();
                    await promise;
                    expect(sectionViewModel.imageLoading()).toBeFalsy();
                })().then(done));

                it('should call notify saved', done => (async () => {
                    sectionViewModel.updateImage();
                    await promise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));

            });

        });

        describe('when image loading failed', () => {

            beforeEach(() => {
                spyOn(imageUpload, 'upload').and.callFake(spec => {
                    spec.error();
                });
            });

            it('should stop image loading', () => {
                sectionViewModel.imageLoading(true);
                sectionViewModel.updateImage();
                expect(sectionViewModel.imageLoading()).toBeFalsy();
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

        describe('when index is Number', () => {

            it('should push question to index', () => {
                sectionViewModel.questions.push({});
                sectionViewModel.questions.push({});
                let question = {
                    id: 'id',
                    title: 'title',
                    type: 'type'
                };
                let result = sectionViewModel.addQuestion(question, 1);
                expect(sectionViewModel.questions.indexOf(result)).toBe(1);
            });

        });

        describe('when index is not a Number', () => {
           
            it('should push question to end', () => {
                sectionViewModel.questions.push({});
                sectionViewModel.questions.push({});
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