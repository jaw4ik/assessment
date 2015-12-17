import CourseViewModel from './index';
import _ from 'underscore';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import notify from 'notify';
import CreateBar from './viewmodels/CreateBarViewModel';
import SectionViewModel from './viewmodels/SectionViewModel';
import courseRepository from 'repositories/courseRepository';
import createSectionCommand from './commands/createSectionCommand';
import createQuestionCommand from './commands/createQuestionCommand';
import deleteQuestionCommand from './commands/deleteQuestionCommand';
import reorderQuestionCommand from './commands/reorderQuestionCommand';
import moveQuestionCommand from './commands/moveQuestionCommand';
import reorderSectionCommand from './commands/reorderSectionCommand';
import unrelateSectionCommand from './commands/unrelateSectionCommand';
import vmContentField from 'viewmodels/common/contentField';

describe('[drag and drop course editor]', () => {

    let courseViewModel;
    let courseId;
    let course;
    let modifiedOn;

    beforeEach(() => {
        courseViewModel = new CourseViewModel();
        modifiedOn = new Date();
        courseId = 'courseId';
        course = {
            id: courseId,
            createdBy: 'user',
            introductionContent: 'introductionContent',
            objectives: [
                {
                    id: 'sectionId1',
                    title: 'sectionTitle1',
                    modifiedOn: modifiedOn,
                    image: 'sectionImage1'
                }, {
                    id: 'sectionId2',
                    title: 'sectionTitle2',
                    modifiedOn: modifiedOn,
                    image: 'sectionImage2'
                }
            ]
        };
        spyOn(notify, 'saved');
    });

    it('should be a class', () => {
        expect(CourseViewModel).toBeFunction();
    });

    it('should be singleton', () => {
        let newCourseViewModel = new CourseViewModel();
        expect(newCourseViewModel).toBe(courseViewModel);
    });

    it('should inititalize fields', () => {
        expect(courseViewModel.id).toBe('');
        expect(courseViewModel.createdBy).toBe('');
        expect(courseViewModel.sections).toBeObservableArray();
        expect(courseViewModel.lastDraggingSectionState).toBe(null);
        expect(courseViewModel.eventTracker).toBe(eventTracker);
        expect(courseViewModel.localizationManager).toBe(localizationManager);
        expect(courseViewModel.courseIntroductionContent).toBe(null);
        expect(courseViewModel.notContainSections).toBeObservable();
        expect(courseViewModel.notContainSections()).toBeFalsy();
        expect(courseViewModel.createBar).toBeInstanceOf(CreateBar);
        expect(courseViewModel.activate).toBeFunction();
        expect(courseViewModel.createSection).toBeFunction();
        expect(courseViewModel.reorderSection).toBeFunction();
        expect(courseViewModel.createSectionWithOrder).toBeFunction();
        expect(courseViewModel.createQuestion).toBeFunction();
        expect(courseViewModel.deleteQuestion).toBeFunction();
        expect(courseViewModel.reorderQuestion).toBeFunction();
        expect(courseViewModel.createQuestionWithOrder).toBeFunction();
        expect(courseViewModel.hideQuestions).toBeFunction();
        expect(courseViewModel.restoreQuestionsExpandingState).toBeFunction();
    });

    describe('activate:', () => {

        let promise;

        beforeEach(() => {
            promise = Promise.resolve(course);
            spyOn(courseRepository, 'getById').and.returnValue(promise);
        });

        it('should set course id', done => (async () => {
            courseViewModel.activate(courseId);
            await promise;
            expect(courseViewModel.id).toBe(courseId);
        })().then(done));

        it('should activate createBar', done => (async () => {
            spyOn(courseViewModel.createBar, 'activate');
            courseViewModel.activate(courseId);
            await promise;
            expect(courseViewModel.createBar.activate).toHaveBeenCalled();
        })().then(done));

        it('should set createdBy', done => (async () => {
            courseViewModel.activate(courseId);
            await promise;
            expect(courseViewModel.createdBy).toBe(course.createdBy);
        })().then(done));

        it('should set sections', done => (async () => {
            courseViewModel.activate(courseId);
            await promise;
            expect(courseViewModel.sections()[0]).toBeInstanceOf(SectionViewModel);
            expect(courseViewModel.sections().length).toBe(2);
        })().then(done));

        it('should set courseIntroductionContent', done => (async () => {
            courseViewModel.activate(courseId);
            await promise;
            expect(courseViewModel.courseIntroductionContent.text()).toBe(course.introductionContent);
        })().then(done));

    });

    describe('createSection:', () => {

        let promise;

        beforeEach(() => {
            promise = Promise.resolve({
                id: 'sectionId3',
                title: 'sectionTitle3',
                modifiedOn: modifiedOn,
                image: 'sectionImage3'
            });
            spyOn(createSectionCommand, 'execute').and.returnValue(promise);
        });

        it('should create section', done => (async () => {
            courseViewModel.createSection({ type: 'section' });
            let result = await promise;
            expect(result.id).toBe('sectionId3');
        })().then(done));

        it('should add created section to view model', done => (async () => {
            courseViewModel.createSection({ type: 'section' });
            await promise;
            let foundSection = _.find(courseViewModel.sections(), section => section.id() === 'sectionId3');
            expect(foundSection.id()).toBe('sectionId3');
        })().then(done));

    });

    describe('reorderSection:', () => {

        describe('when section id is not defined', () => {

            it('should do nothing', done => (async () => {
                let result = await courseViewModel.reorderSection();
                expect(result).toBe(undefined);
            })().then(done));

            it('should not call reorder section command', done => (async () => {
                spyOn(reorderSectionCommand, 'execute');
                await courseViewModel.reorderSection();
                expect(reorderSectionCommand.execute).not.toHaveBeenCalled();
            })().then(done));

        });

        describe('when section id is defined', () => {

            let promise;

            beforeEach(() => {
                promise = Promise.resolve();
                spyOn(reorderSectionCommand, 'execute').and.returnValue(promise);
            });

            it('should show notify saved message', done => (async () => {
                courseViewModel.reorderSection({ sectionId: course.objectives[0].id });
                await promise;
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

            describe('when next section id is not defined', () => {

                it('should push section to end', done => (async () => {
                    courseViewModel.reorderSection({ sectionId: course.objectives[0].id });
                    await promise;
                    let length = courseViewModel.sections().length;
                    expect(courseViewModel.sections()[length - 1].id()).toBe(course.objectives[0].id);
                })().then(done));

            });

            describe('when next section id is defined', () => {

                it('should push section before next section', done => (async () => {
                    courseViewModel.reorderSection({ sectionId: course.objectives[0].id }, { sectionId: course.objectives[1].id });
                    await promise;
                    expect(courseViewModel.sections()[0].id()).toBe(course.objectives[0].id);
                })().then(done));

            });

        });

    });

    describe('createSectionWithOrder:', () => {

        describe('when type is not defined', () => {

            it('should do nothing', done => (async () => {
                let result = await courseViewModel.createSectionWithOrder();
                expect(result).toBe(undefined);
            })().then(done));
        });

        describe('when type is defined', () => {

            let createSectionPromise;
            let reorderSectionPromise;

            beforeEach(() => {
                createSectionPromise = Promise.resolve({
                    id: 'sectionId4',
                    title: 'sectionTitle4',
                    modifiedOn: modifiedOn,
                    image: 'sectionImage4'
                });
                reorderSectionPromise = Promise.resolve();

                spyOn(createSectionCommand, 'execute').and.returnValue(createSectionPromise);
                spyOn(reorderSectionCommand, 'execute').and.returnValue(reorderSectionPromise);
            });

            it('should show notify saved message', done => (async () => {
                courseViewModel.createSectionWithOrder({ type: 'section' });
                await createSectionPromise;
                await reorderSectionPromise;
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

            describe('when next section id is not defined', () => {

                it('should push section to end', done => (async () => {
                    courseViewModel.createSectionWithOrder({ type: 'section' });
                    await createSectionPromise;
                    await reorderSectionPromise;
                    let length = courseViewModel.sections().length;
                    expect(courseViewModel.sections()[length - 1].id()).toBe('sectionId4');
                })().then(done));

            });

            describe('when next section id is defined', () => {

                it('should push section before the next section', done => (async () => {
                    courseViewModel.createSectionWithOrder({ type: 'section' }, { sectionId: courseViewModel.sections()[2].id() });
                    await createSectionPromise;
                    await reorderSectionPromise;
                    expect(courseViewModel.sections()[2].id()).toBe('sectionId4');
                })().then(done));

            });

        });

    });

    describe('createQuestion:', () => {
        
    });

    describe('deleteQuestion:', () => {
        
    });

    describe('reorderQuestion:', () => {
        
    });

    describe('createQuestionWithOrder:', () => {
        
    });

    describe('hideQuestions:', () => {

        describe('when section id is not defined', () => {

            it('should do nothing', () => {
                let result = courseViewModel.hideQuestions();
                expect(result).toBe(undefined);
            });

        });

        describe('whne section with id is not found', () => {

            it('should do nothing', () => {
                let result = courseViewModel.hideQuestions({ sectionId: 'blablalbla' });
                expect(result).toBe(undefined);
            });

        });

        describe('when section id is defined and sevtion found', () => {

            it('should update last dragging section state', () => {
                courseViewModel.sections()[0].questionsExpanded(true);
                courseViewModel.hideQuestions({ sectionId: courseViewModel.sections()[0].id() });
                expect(courseViewModel.lastDraggingSectionState).toBeTruthy();
            });

            it('should hide questions', () => {
                courseViewModel.sections()[0].questionsExpanded(true);
                courseViewModel.hideQuestions({ sectionId: courseViewModel.sections()[0].id() });
                expect(courseViewModel.sections()[0].questionsExpanded()).toBeFalsy();
            });

        });

    });

    describe('restoreQuestionsExpandingState:', () => {
        
        describe('when section id is not defined', () => {

            it('should do nothing', () => {
                let result = courseViewModel.restoreQuestionsExpandingState();
                expect(result).toBe(undefined);
            });

        });

        describe('whne section with id is not found', () => {

            it('should do nothing', () => {
                let result = courseViewModel.restoreQuestionsExpandingState({ sectionId: 'blablalbla' });
                expect(result).toBe(undefined);
            });

        });

        describe('when section id is defined and sevtion found', () => {
            
            it('should restore previous state of questions', () => {
                courseViewModel.lastDraggingSectionState = true;
                courseViewModel.sections()[0].questionsExpanded(false);
                courseViewModel.restoreQuestionsExpandingState({ sectionId: courseViewModel.sections()[0].id() });
                expect(courseViewModel.sections()[0].questionsExpanded()).toBeTruthy();
            });

        });

    });
    
});