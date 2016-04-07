import CourseViewModel from './index';

import ko from 'knockout';
import _ from 'underscore';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import notify from 'notify';
import constants from 'constants';
import clientContext from 'clientContext';
import CreateBar from './viewmodels/CreateBarViewModel';
import SectionViewModel from './viewmodels/SectionViewModel';
import courseRepository from 'repositories/courseRepository';
import createSectionCommand from './commands/createSectionCommand';
import createQuestionCommand from './commands/createQuestionCommand';
import deleteQuestionCommand from './commands/deleteQuestionCommand';
import reorderQuestionCommand from './commands/reorderQuestionCommand';
import moveQuestionCommand from './commands/moveQuestionCommand';
import reorderSectionCommand from './commands/reorderSectionCommand';
import deleteSectionDialog from 'editor/course/dialogs/deleteSection/deleteSection';
import userContext from 'userContext';
import questionModalView from 'editor/questions/questionModalView';

describe('[drag and drop course editor]', () => {

    let courseViewModel;
    let courseId;
    let course;
    let modifiedOn;
    const eventCategory = 'Course editor (drag and drop)';

    beforeEach(() => {
        courseViewModel = new CourseViewModel();
        modifiedOn = new Date();
        courseId = 'courseId';
        course = {
            id: courseId,
            createdBy: 'user',
            introductionContent: 'introductionContent',
            sections: [
                {
                    id: 'sectionId1',
                    title: 'sectionTitle1',
                    modifiedOn: modifiedOn,
                    image: 'sectionImage1',
                    learningObjective: ''
                }, {
                    id: 'sectionId2',
                    title: 'sectionTitle2',
                    modifiedOn: modifiedOn,
                    image: 'sectionImage2',
                    learningObjective: ''
                }
            ]
        };
        spyOn(notify, 'saved');
        spyOn(eventTracker, 'publish');
        userContext.identity = {
            email: 'email'
        };
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
        expect(courseViewModel.highlightedSectionId).toBeObservable();
        expect(courseViewModel.highlightedSectionId()).toBeNull();
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

        let promise,
            modalViewInit;

        beforeEach(() => {
            courseViewModel.id = '';
            promise = Promise.resolve(course);
            modalViewInit = Promise.resolve();
            spyOn(courseRepository, 'getById').and.returnValue(promise);
            spyOn(questionModalView, 'initialize').and.returnValue(modalViewInit);
            spyOn(questionModalView, 'open').and.returnValue(Promise.resolve());
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
            expect(courseViewModel.sections()[0].questionsExpanded()).toBeTruthy();
            expect(courseViewModel.sections()[1].questionsExpanded()).toBeFalsy();
        })().then(done));

        it('should set courseIntroductionContent', done => (async () => {
            courseViewModel.activate(courseId);
            await promise;
            expect(courseViewModel.courseIntroductionContent.text()).toBe(course.introductionContent);
        })().then(done));
            
        it('should initialize questions popup', done => (async () => {
            courseViewModel.activate(courseId);
            await promise;
            expect(questionModalView.initialize).toHaveBeenCalledWith(courseId);
        })().then(done));

        describe('when client context highlighted section id is defined', () => {
            let sectionId = 'objId';
            beforeEach(() => {
                spyOn(clientContext, 'get').and.returnValue(sectionId);
                spyOn(clientContext, 'remove');
            });

            it('should remove highlighted section id from client context', done => (async () => {
                courseViewModel.activate(courseId);
                await promise;
                await modalViewInit;
                expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.highlightedSectionId);
            })().then(done));

            it('should set highlightedSectionId', done => (async () => {
                courseViewModel.highlightedSectionId(null);
                courseViewModel.activate(courseId);
                await promise;
                await modalViewInit;
                expect(courseViewModel.highlightedSectionId()).toBe(sectionId);
            })().then(done));
        });

        describe('when client context question data to navigate is defined', () => {
            let sectionId = 'objId',
                questionId = 'questionId';
            beforeEach(() => {
                spyOn(clientContext, 'get').and.returnValue({questionId: questionId, sectionId: sectionId});
                spyOn(clientContext, 'remove');
            });

            it('should remove question data to navigate from client context', done => (async () => {
                courseViewModel.activate(courseId);
                await promise;
                await modalViewInit;
                expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.questionDataToNavigate);
            })().then(done));

            describe('and when section found', () => {
                let section = { id: ko.observable(sectionId) };
                beforeEach(() => {
                    courseViewModel.sections = ko.observableArray([section]);
                });

                describe('and when question found', () => {
                    let question = {id: ko.observable(questionId), open: ()=> {} };
                    beforeEach(() => {
                        section.questions = ko.observableArray([question]);
                        spyOn(question, 'open');
                    });

                    it('when open question', done => (async () => {
                        courseViewModel.activate(courseId);
                        await promise;
                        await modalViewInit;
                        expect(question.open).toHaveBeenCalled();
                    })().then(done));
                });
            });
        });
    });

    describe('createSection:', () => {

        let promise;

        beforeEach(() => {
            promise = Promise.resolve({
                id: 'sectionId3',
                title: 'sectionTitle3',
                modifiedOn: modifiedOn,
                image: 'sectionImage3',
                learningObjective: 'learningObjective'
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

        it('should show notify saved message', done => (async () => {
            courseViewModel.createSection({ type: 'section' });
            await promise;
            expect(notify.saved).toHaveBeenCalled();
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
                courseViewModel.reorderSection({ sectionId: course.sections[0].id });
                await promise;
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

            describe('when next section id is not defined', () => {

                it('should push section to end', done => (async () => {
                    courseViewModel.reorderSection({ sectionId: course.sections[0].id });
                    await promise;
                    let length = courseViewModel.sections().length;
                    expect(courseViewModel.sections()[length - 1].id()).toBe(course.sections[0].id);
                })().then(done));

            });

            describe('when next section id is defined', () => {

                it('should push section before next section', done => (async () => {
                    courseViewModel.reorderSection({ sectionId: course.sections[0].id }, { sectionId: course.sections[1].id });
                    await promise;
                    expect(courseViewModel.sections()[0].id()).toBe(course.sections[0].id);
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
                    image: 'sectionImage4',
                    learningObjective: 'learningObjective'
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

    describe('deleteSection:', () => {

        it('should show dialog', () => {
            spyOn(deleteSectionDialog, 'show');
            var section = {
                id: ko.observable('some_id'),
                title: ko.observable('some title'),
                createdBy: 'username'
            };
            courseViewModel.deleteSection(section);
            expect(deleteSectionDialog.show).toHaveBeenCalledWith(courseViewModel.id, section.id(), section.title(), section.createdBy);
        });

    });

    describe('createSectionAtFirstPosition:', () => {
        
        let createSectionPromise;
        let reorderSectionPromise;

        beforeEach(() => {
            createSectionPromise = Promise.resolve({
                id: 'sectionId3',
                title: 'sectionTitle3',
                modifiedOn: modifiedOn,
                image: 'sectionImage3',
                learningObjective: 'learningObjective'
            });
            reorderSectionPromise = Promise.resolve({});
            spyOn(createSectionCommand, 'execute').and.returnValue(createSectionPromise);
            spyOn(reorderSectionCommand, 'execute').and.returnValue(reorderSectionPromise);
        });

        it('should create section', done => (async () => {
            courseViewModel.createSectionAtFirstPosition();
            let result = await createSectionPromise;
            await reorderSectionPromise;
            expect(result.id).toBe('sectionId3');
        })().then(done));

        it('should add created section to view model at first position', done => (async () => {
            courseViewModel.createSectionAtFirstPosition();
            await createSectionPromise;
            await reorderSectionPromise;
            expect(courseViewModel.sections()[0].id()).toBe('sectionId3');
        })().then(done));

        it('should should reorder sections', done => (async () => {
            courseViewModel.createSectionAtFirstPosition();
            await createSectionPromise;
            await reorderSectionPromise;
            expect(reorderSectionCommand.execute).toHaveBeenCalled();
        })().then(done));

    });

    describe('createQuestion:', () => {

        let sectionId = 'some_id';
        let questionType = 'question_type';
        let createdQuestion = { id: 'new_question' };
        let createdQuestionViewModel = { updateFields: jasmine.createSpy() };
        let createQuestionCommandPromise;

        beforeEach(() => {
            courseViewModel.sections = ko.observableArray([new SectionViewModel(null, { id: sectionId })]);
            createQuestionCommandPromise = Promise.resolve(createdQuestion);
            spyOn(createQuestionCommand, 'execute').and.returnValue(createQuestionCommandPromise);
            spyOn(courseViewModel.sections()[0], 'addQuestion').and.returnValue(createdQuestionViewModel);
        });

        describe('when section viewmodel is defined', () => {

            it('should add question', () => {
                courseViewModel.createQuestion({}, null, { sectionId: sectionId });
                expect(courseViewModel.sections()[0].addQuestion).toHaveBeenCalled();
            });

            it('should execute createQuestion command', () => {
                courseViewModel.createQuestion({ type: questionType }, null, { sectionId: sectionId });
                expect(createQuestionCommand.execute).toHaveBeenCalledWith(sectionId, questionType, eventCategory);
            });

            it('should update created question fields', done => (async () => {
                courseViewModel.createQuestion({ type: questionType }, null, { sectionId: sectionId });
                await createQuestionCommandPromise;
                expect(createdQuestionViewModel.updateFields).toHaveBeenCalledWith(createdQuestion);
            })().then(done));

        });

    });

    describe('deleteQuestion:', () => {

        let sectionId = 'some_section_id';
        let question = { id: ko.observable('some_question_id'), sectionId: sectionId };
        let deleteQuestionCommandPromise;

        beforeEach(() => {
            courseViewModel.sections = ko.observableArray([new SectionViewModel(null, { id: sectionId })]);
            deleteQuestionCommandPromise = Promise.resolve();
            spyOn(deleteQuestionCommand, 'execute').and.returnValue(deleteQuestionCommandPromise);
        });

        it('should execute deleteQuestion command', () => {
            courseViewModel.deleteQuestion(question);
            expect(deleteQuestionCommand.execute).toHaveBeenCalledWith(question.sectionId, question.id());
        });

        it('should call deleteQuestion', done => (async () => {
            spyOn(courseViewModel.sections()[0], 'deleteQuestion');
            courseViewModel.deleteQuestion(question);
            await deleteQuestionCommandPromise;
            expect(courseViewModel.sections()[0].deleteQuestion).toHaveBeenCalledWith(question);
        })().then(done));

        it('should notify', done => (async () => {
            courseViewModel.deleteQuestion(question);
            await deleteQuestionCommandPromise;
            expect(notify.saved).toHaveBeenCalled();
        })().then(done));

    });

    describe('reorderQuestion:', () => {
        let question, nextQuestion, source, target;
        let moveQuestionCommandPromise, reorderQuestionCommandPromise;

        beforeEach(() => {
            question = { id: 'question_id' };
            nextQuestion = { id: 'next_question_id' };
            source = { sectionId: 'source_section_id' };
            target = { sectionId: 'target_section_id' };
                
            moveQuestionCommandPromise = Promise.resolve();
            spyOn(moveQuestionCommand, 'execute').and.returnValue(moveQuestionCommandPromise);
            reorderQuestionCommandPromise = Promise.resolve();
            spyOn(reorderQuestionCommand, 'execute').and.returnValue(reorderQuestionCommandPromise);
        });

        describe('when target and source are equal', () => {
            let sectionModel;
            let questionModel;

            beforeEach(() => {
                questionModel = { id: ko.observable(question.id) };
                
                sectionModel = {
                    id: ko.observable(source.sectionId), 
                    questions: ko.observableArray([questionModel]),
                    deleteQuestion: () => {},
                    addQuestion: () => {}
                };

                spyOn(sectionModel, 'deleteQuestion');
                spyOn(sectionModel, 'addQuestion');

                courseViewModel.sections = ko.observableArray([sectionModel]);
            });

            it('should delete question from section viewmodel', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, source, source);
                expect(sectionModel.deleteQuestion).toHaveBeenCalledWith(questionModel);
            });

            it('should add question with next question id', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, source, source);
                expect(sectionModel.addQuestion).toHaveBeenCalledWith(questionModel, nextQuestion.id);
            });

            describe('and next question is not defined', () => {
                it('should add question with null', () => {
                    courseViewModel.reorderQuestion(question, null, source, source);
                    expect(sectionModel.addQuestion).toHaveBeenCalledWith(questionModel, null);
                });
            });

            it('should send event \'Change order of questions\'', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, source, source);
                expect(eventTracker.publish).toHaveBeenCalledWith('Change order of questions', eventCategory);
            });

            it('should call reorder questions command', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, source, source);
                expect(reorderQuestionCommand.execute).toHaveBeenCalledWith(sectionModel.id(), sectionModel.questions());
            });

            describe('and reorder is complete', () => {
                it('should show notify saved message', done => (async () => {
                    courseViewModel.reorderQuestion(question, nextQuestion, source, source);
                    await reorderQuestionCommandPromise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));
            });
        });

        describe('when target and source are not equal', () => {
            let targetSectionModel;
            let sourceSectionModel;
            let questionModel;

            beforeEach(() => {
                questionModel = { id: ko.observable(question.id) };
                
                targetSectionModel = {
                    id: ko.observable(target.sectionId), 
                    questions: ko.observableArray([]),
                    addQuestion: () => {}
                };
                
                sourceSectionModel = {
                    id: ko.observable(source.sectionId), 
                    questions: ko.observableArray([questionModel]),
                    deleteQuestion: () => {}
                };

                spyOn(sourceSectionModel, 'deleteQuestion');
                spyOn(targetSectionModel, 'addQuestion');

                courseViewModel.sections = ko.observableArray([sourceSectionModel, targetSectionModel]);
            });

            it('should delete question from source section viewmodel', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, target, source);
                expect(sourceSectionModel.deleteQuestion).toHaveBeenCalledWith(questionModel);
            });

            it('should add question to target section with next question id', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, target, source);
                expect(targetSectionModel.addQuestion).toHaveBeenCalledWith(questionModel, nextQuestion.id);
            });

            describe('and next question is not defined', () => {
                it('should add question to the target section with null', () => {
                    courseViewModel.reorderQuestion(question, null, target, source);
                    expect(targetSectionModel.addQuestion).toHaveBeenCalledWith(questionModel, null);
                });
            });

            it('should send event \'Move item\'', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, target, source);
                expect(eventTracker.publish).toHaveBeenCalledWith('Move item', eventCategory);
            });

            it('should call move questions command', () => {
                courseViewModel.reorderQuestion(question, nextQuestion, target, source);
                expect(moveQuestionCommand.execute).toHaveBeenCalledWith(question.id, source.sectionId, target.sectionId);
            });

            describe('and move is complete', () => {

                describe('and next question undefined', () => {
                    it('should show notify saved message', done => (async () => {
                        courseViewModel.reorderQuestion(question, null, target, source);
                        await moveQuestionCommandPromise;
                        expect(notify.saved).toHaveBeenCalled();
                    })().then(done));
                });

                it('should reorder target section questions', done => (async () => {
                    courseViewModel.reorderQuestion(question, nextQuestion, target, source);
                    await moveQuestionCommandPromise;
                    expect(reorderQuestionCommand.execute).toHaveBeenCalledWith(targetSectionModel.id(), targetSectionModel.questions());
                })().then(done));

                it('should show notify saved message', done => (async () => {
                    courseViewModel.reorderQuestion(question, nextQuestion, target, source);
                    await moveQuestionCommandPromise;
                    await reorderQuestionCommandPromise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));
            });
        });

    });

    describe('createQuestionWithOrder:', () => {

        let question, nextQuestion, targetSection;
        let createdQuestion = { id: 'created_question_id' };
        let createdQuestionViewModel = { updateFields: jasmine.createSpy(), isProcessed: ko.observable(false) };
        let createQuestionCommandPromise, reorderQuestionCommandPromise;

        beforeEach(() => {
            question = { type: 'question_type' };
            nextQuestion = { id: 'next_question_id' };
            targetSection = { sectionId: 'target_section_id' };

            courseViewModel.sections = ko.observableArray([
                new SectionViewModel(null, { id: targetSection.sectionId, questions: [{ id: question.id }]})
            ]);
            spyOn(courseViewModel.sections()[0], 'addQuestion').and.returnValue(createdQuestionViewModel);

            createQuestionCommandPromise = Promise.resolve(createdQuestion);
            spyOn(createQuestionCommand, 'execute').and.returnValue(createQuestionCommandPromise);
            reorderQuestionCommandPromise = Promise.resolve();
            spyOn(reorderQuestionCommand, 'execute').and.returnValue(reorderQuestionCommandPromise);
        });

        describe('when next question is not null', () => {

            beforeEach(() => {
                nextQuestion.id = 'next_question_id';
            });

            it('should send event \'Change order of questions\'', done => (async () => {
                courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
                expect(eventTracker.publish).toHaveBeenCalledWith('Change order of questions', eventCategory);
            })().then(done));

            it('should add question to section next question id', done => (async () => {
                let section = courseViewModel.sections()[0];
                
                courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);

                expect(section.addQuestion).toHaveBeenCalledWith({}, nextQuestion.id);
            })().then(done));

        });

        describe('when next question is null', () => {
            
            beforeEach(() => {
                nextQuestion = null;
            });

            it('should add question to section', done => (async () => {
                let section = courseViewModel.sections()[0];
                courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
                expect(section.addQuestion).toHaveBeenCalledWith({});
            })().then(done));

        });

        it('should execute createQuestion command', () => {
            courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
            expect(createQuestionCommand.execute).toHaveBeenCalledWith(targetSection.sectionId, question.type, eventCategory);
        });

        it('should update question fields', done => (async () => {
            courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
            await createQuestionCommandPromise;
            expect(createdQuestionViewModel.updateFields).toHaveBeenCalledWith(createdQuestion, true);
        })().then(done));

        it('should execute reorderQuestion command', done => (async () => {
            let section = courseViewModel.sections()[0];
            courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
            await createQuestionCommandPromise;
            expect(reorderQuestionCommand.execute).toHaveBeenCalledWith(section.id(), section.questions());
        })().then(done));

        it('should set isProcessed to false', done => (async () => {
            createdQuestionViewModel.isProcessed(true);
            courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
            await createQuestionCommandPromise;
            await reorderQuestionCommandPromise;
            expect(createdQuestionViewModel.isProcessed()).toBeFalsy();
        })().then(done));

        it('should show notify saved message', done => (async () => {
            courseViewModel.createQuestionWithOrder(question, nextQuestion, targetSection);
            await createQuestionCommandPromise;
            await reorderQuestionCommandPromise;
            expect(notify.saved).toHaveBeenCalled();
        })().then(done));

    });

    describe('hideQuestions:', () => {

        describe('when section id is not defined', () => {

            it('should do nothing', () => {
                let result = courseViewModel.hideQuestions();
                expect(result).toBe(undefined);
            });

        });

        describe('when section with id is not found', () => {

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