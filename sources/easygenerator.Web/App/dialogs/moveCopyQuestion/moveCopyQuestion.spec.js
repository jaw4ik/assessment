import viewModel from 'dialogs/moveCopyQuestion/moveCopyQuestion';

import router from 'routing/router';
import eventTracker from 'eventTracker';
import dataContext from 'dataContext';
import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';
import questionRepository from 'repositories/questionRepository';
import notify from 'notify';
import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';

describe('moveCopyQuestionDialog', function () {

    var ids = {
        courseId: 'courseId',
        sectionId: 'sectionId',
        questionId: 'questionId'
    },
        userName = 'user@user.com',
        moveQuestionDefer,
        copyQuestionDefer,
        allSectionsTitle = 'title',
        courses = [
            {
                id: 'courseId',
                title: 'courseTitle',
                sections: [{}]
            },
            {
                id: 'courseId2',
                title: 'courseTitle2',
                sections: [{}]
            },
            {
                id: 'courseId3',
                title: 'courseTitle3',
                sections: [{}]
            }
        ];

    beforeEach(function () {
        moveQuestionDefer = Q.defer();
        copyQuestionDefer = Q.defer();
        spyOn(questionRepository, 'moveQuestion').and.returnValue(moveQuestionDefer.promise);
        spyOn(questionRepository, 'copyQuestion').and.returnValue(copyQuestionDefer.promise);
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(localizationManager, 'localize').and.returnValue(allSectionsTitle);
        spyOn(notify, 'error');
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
    });

    describe('courseId', function () {

        it('should be string', function () {
            expect(viewModel.courseId).toBeString();
        });

    });

    describe('sectionId', function () {

        it('should be observable', function () {
            expect(viewModel.sectionId).toBeObservable();
        });

    });

    describe('questionId', function () {

        it('should be string', function () {
            expect(viewModel.questionId).toBeString();
        });

    });

    describe('show:', function () {

        beforeEach(function () {
            userContext.identity = { email: userName };
            dataContext.courses = courses;
        });

        it('should be function', function () {
            expect(viewModel.show).toBeFunction();
        });

        it('should send event \'Open move/copy question dialog\'', function () {
            viewModel.show();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open move/copy question dialog');
        });

        it('should show dialog', function () {
            viewModel.show();
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.moveCopyQuestion.settings);
        });

        it('should set copy mode', function () {
            viewModel.isCopy(false);
            viewModel.show();
            expect(viewModel.isCopy()).toBeTruthy();
        });

        it('should set courseId', function () {
            viewModel.courseId = '';
            viewModel.show(ids.courseId);
            expect(viewModel.courseId).toBe(ids.courseId);
        });

        it('should map courses from context', function () {
            viewModel.courses([]);

            viewModel.show(ids.courseId);

            expect(viewModel.courses().length).toBe(3);
        });

        it('should order courses by creation date', function () {
            courses[0].createdOn = new Date(2012, 12, 12);
            courses[1].createdOn = new Date(2015, 2, 1);
            courses[2].createdOn = new Date(2014, 1, 12);

            viewModel.courses([]);

            viewModel.show(ids.courseId);

            expect(viewModel.courses()[0].id).toBe(courses[1].id);
            expect(viewModel.courses()[1].id).toBe(courses[2].id);
            expect(viewModel.courses()[2].id).toBe(courses[0].id);
        });

        it('should move collaborators\' courses to the end of list', function () {
            courses[0].createdOn = new Date(2012, 12, 12);
            courses[0].createdBy = userName;
            courses[1].createdOn = new Date(2015, 2, 1);
            courses[1].createdBy = 'collaborator@mail.dom';
            courses[2].createdOn = new Date(2014, 1, 12);
            courses[2].createdBy = userName;

            viewModel.courses([]);

            viewModel.show(ids.courseId);

            expect(viewModel.courses()[0].id).toBe(courses[2].id);
            expect(viewModel.courses()[1].id).toBe(courses[0].id);
            expect(viewModel.courses()[2].id).toBe(courses[1].id);
        });

        it('should set sectionId', function () {
            viewModel.sectionId('');
            viewModel.show(ids.courseId, ids.sectionId);
            expect(viewModel.sectionId()).toBe(ids.sectionId);
        });

        it('should set questionId', function () {
            viewModel.questionId = '';
            viewModel.show(ids.courseId, ids.sectionId, ids.questionId);
            expect(viewModel.questionId).toBe(ids.questionId);
        });

        it('should set selected sectionId', function () {
            viewModel.show(ids.courseId, ids.sectionId, ids.questionId);
            expect(viewModel.selectedSectionId()).toBe(ids.sectionId);
        });

        it('should set object allSections', function () {
            viewModel.allSections({});
            viewModel.show();
            expect(viewModel.allSections().title).toBe(allSectionsTitle);
            expect(viewModel.allSections().sections).toBe(dataContext.sections);
        });

        describe('when courseId is defined', function () {

            it('should select course from dataContext', function () {
                viewModel.show(ids.courseId, ids.sectionId, ids.questionId);
                expect(viewModel.selectedCourse().id).toBe(courses[0].id);
                expect(viewModel.selectedCourse().title).toBe(courses[0].title);
                expect(viewModel.selectedCourse().sections).toBe(courses[0].sections);
                expect(viewModel.selectedCourse().objectvesListEmpty).toBe(courses[0].sections === 0);
            });

        });

        describe('when courseId is undefined', function () {

            it('should set select to allSections', function () {
                viewModel.show(null, ids.sectionId, ids.questionId);
                expect(viewModel.selectedCourse().title).toBe(allSectionsTitle);
                expect(viewModel.selectedCourse().sections).toBe(dataContext.sections);
            });

        });

    });

    describe('close', function () {
        it('should close dialog', function () {
            viewModel.close();
            expect(dialog.close).toHaveBeenCalled();
        });
    });

    describe('changeMoveCopyAction:', function () {

        it('should be function', function () {
            expect(viewModel.changeMoveCopyAction).toBeFunction();
        });

        describe('when action is copy', function () {

            it('should send event \'Switch to "copy" item\'', function () {
                viewModel.isCopy(true);
                viewModel.changeMoveCopyAction();
                expect(eventTracker.publish).toHaveBeenCalledWith('Switch to "copy" item');
            });

        });

        describe('when action is move', function () {

            it('should send event \'Switch to "move" item\'', function () {
                viewModel.isCopy(false);
                viewModel.changeMoveCopyAction();
                expect(eventTracker.publish).toHaveBeenCalledWith('Switch to "move" item');
            });

        });

    });

    describe('setCopyAction:', function () {

        it('should be function', function () {
            expect(viewModel.setCopyAction).toBeFunction();
        });

        describe('when isCopy is true', function () {
            it('should not publish event', function () {
                viewModel.isCopy(true);

                viewModel.setCopyAction();

                expect(eventTracker.publish).not.toHaveBeenCalled();
            });
        });

        it('should set isCopy in true', function () {
            viewModel.isCopy(false);

            viewModel.setCopyAction();

            expect(viewModel.isCopy()).toBeTruthy();
        });

        it('should publish event \'Switch to "copy" item\'', function () {
            viewModel.isCopy(false);

            viewModel.setCopyAction();

            expect(eventTracker.publish).toHaveBeenCalledWith('Switch to "copy" item');
        });

    });

    describe('setMoveAction:', function () {

        it('should be function', function () {
            expect(viewModel.setMoveAction).toBeFunction();
        });

        describe('when isCopy is false', function () {
            it('should not publish event', function () {
                viewModel.isCopy(false);

                viewModel.setMoveAction();

                expect(eventTracker.publish).not.toHaveBeenCalled();
            });
        });

        it('should set isCopy in false', function () {
            viewModel.isCopy(true);

            viewModel.setMoveAction();

            expect(viewModel.isCopy()).toBeFalsy();
        });

        it('should publish event \'Switch to "move" item\'', function () {
            viewModel.isCopy(true);

            viewModel.setMoveAction();

            expect(eventTracker.publish).toHaveBeenCalledWith('Switch to "move" item');
        });

    });

    describe('selectedCourse', function () {

        it('should be observable', function () {
            expect(viewModel.selectedCourse).toBeObservable();
        });

    });

    describe('selectCourse:', function () {

        it('should be function', function () {
            expect(viewModel.selectCourse).toBeFunction();
        });

        it('should select course', function () {
            viewModel.selectedCourse(null);
            viewModel.selectCourse({ id: 'This is id!', sections: [], objectvesListEmpty: true });
            expect(viewModel.selectedCourse().id).toBe('This is id!');
        });

        describe('when selected course has sections', function () {

            it('should set selected section id', function () {
                viewModel.selectedSectionId(null);
                viewModel.selectCourse({ id: 'This is id!', sections: [{ id: 1 }], objectvesListEmpty: false });
                expect(viewModel.selectedSectionId()).toBe(1);
            });

        });

        describe('when selected course has sections', function () {

            it('should set selected section id to null', function () {
                viewModel.selectedSectionId(1);
                viewModel.selectCourse({ id: 'This is id!', sections: [], objectvesListEmpty: true });
                expect(viewModel.selectedSectionId()).toBe(null);
            });

        });

    });

    describe('selectedSectionId', function () {

        it('should be observable', function () {
            expect(viewModel.selectedSectionId).toBeObservable();
        });

    });

    describe('selectSection:', function () {

        it('should be function', function () {
            expect(viewModel.selectSection).toBeFunction();
        });

        it('should set selected section id', function () {
            var section = {
                id: 'someid'
            };
            viewModel.selectedSectionId('');
            viewModel.selectSection(section);
            expect(viewModel.selectedSectionId()).toBe(section.id);
        });

    });

    describe('courses', function () {

        it('should be observable', function () {
            expect(viewModel.courses).toBeObservable();
        });

    });

    describe('allSections', function () {

        it('should be observable', function () {
            expect(viewModel.allSections).toBeObservable();
        });

    });

    describe('moveQuestion:', function () {
        var sectionId = 'selectedSectionId';

        beforeEach(function () {
            viewModel.selectedSectionId(sectionId);
        });

        it('should be function', function () {
            expect(viewModel.moveQuestion).toBeFunction();
        });

        describe('when selected section is not valid', function () {

            describe('when section is not selected', function () {

                beforeEach(function () {
                    viewModel.selectedSectionId(null);
                });

                it('should show notify error', function () {
                    viewModel.moveQuestion();
                    expect(localizationManager.localize).toHaveBeenCalledWith('moveCopyErrorMessage');
                    expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                });

            });

            describe('when section is selected', function () {

                describe('and when section is not found in course', function () {

                    beforeEach(function () {
                        dataContext.courses = [{
                            id: 1,
                            sections: [{
                                id: 1
                            }, {
                                id: 2
                            }
                            ]
                        }
                        ];
                        viewModel.selectedCourse(dataContext.courses[0]);
                        viewModel.selectedSectionId(3);
                    });

                    it('should show notify error', function () {
                        viewModel.moveQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('sectionHasBeenDisconnectedByCollaborator');
                        expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                    });

                });

                describe('and when section is not found dataContext sections', function () {

                    beforeEach(function () {
                        var allobjs = [
                            {
                                id: 1
                            }, {
                                id: 2
                            }
                        ];
                        dataContext.sections = allobjs;
                        viewModel.allSections(allobjs);
                        viewModel.selectedSectionId(3);
                        viewModel.selectedCourse(allobjs);
                    });

                    it('should show notify error', function () {
                        viewModel.moveQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('sectionHasBeenDisconnectedByCollaborator');
                        expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                    });

                });

            });

        });

        describe('when selected section is valid', function () {

            beforeEach(function () {
                var allobjs = [
                    {
                        id: 1
                    }, {
                        id: 2
                    }
                ];
                dataContext.sections = allobjs;
                viewModel.allSections(allobjs);
                viewModel.selectedSectionId(2);
                viewModel.selectedCourse(allobjs);
            });

            it('should send event \'Move item\'', function () {
                viewModel.moveQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Move item');
            });

            describe('when current section id equal selected section id', function () {

                it('should hide popup', function () {
                    viewModel.sectionId(1);
                    viewModel.selectedSectionId(1);
                    viewModel.moveQuestion();
                    expect(dialog.close).toHaveBeenCalled();
                });

            });

            describe('when current section id not equal selected section id', function () {
                var currentSectionId = 1,
                    selectedSectionId = 2;

                beforeEach(function () {
                    viewModel.questionId = 'questionId';
                    viewModel.courseId = 'courseId';
                    viewModel.sectionId(currentSectionId);
                    viewModel.selectedSectionId(selectedSectionId);
                });

                it('should call moveQuestion from repository', function () {
                    viewModel.moveQuestion();
                    expect(questionRepository.moveQuestion).toHaveBeenCalledWith(viewModel.questionId, viewModel.sectionId(), viewModel.selectedSectionId());
                });

                describe('when question was move', function () {
                    var newQuestionId;
                    beforeEach(function () {
                        newQuestionId = 'newQuestionId';
                        moveQuestionDefer.resolve({ id: newQuestionId });
                    });

                    it('should hide popup', function (done) {
                        viewModel.moveQuestion();

                        moveQuestionDefer.promise.fin(function () {
                            expect(dialog.close).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course is undefined', function () {

                        beforeEach(function () {
                            viewModel.courseId = null;
                        });

                        it('should navigate to current section', function (done) {
                            viewModel.moveQuestion();

                            moveQuestionDefer.promise.fin(function () {
                                expect(router.navigate).toHaveBeenCalledWith('library/sections/' + viewModel.sectionId());
                                done();
                            });
                        });

                    });

                    describe('when course is not undefined', function () {

                        beforeEach(function () {
                            viewModel.courseId = 'courseid';
                        });

                        it('should navigate to current section', function (done) {
                            viewModel.moveQuestion();

                            moveQuestionDefer.promise.fin(function () {
                                expect(router.navigate).toHaveBeenCalledWith('courses/' + viewModel.courseId + '/sections/' + viewModel.sectionId());
                                done();
                            });
                        });

                    });

                });

            });

        });

    });

    describe('copyQuestion:', function () {

        var currentSectionId = 1,
            selectedSectionId = 2;

        beforeEach(function () {
            viewModel.questionId = 'questionId';
            viewModel.courseId = 1;
            viewModel.sectionId(currentSectionId);
            viewModel.selectedSectionId(selectedSectionId);
        });

        it('should be function', function () {
            expect(viewModel.copyQuestion).toBeFunction();
        });

        describe('when selected section is not valid', function () {

            describe('when section is not selected', function () {

                beforeEach(function () {
                    viewModel.selectedSectionId(null);
                });

                it('should show notify error', function () {
                    viewModel.copyQuestion();
                    expect(localizationManager.localize).toHaveBeenCalledWith('moveCopyErrorMessage');
                    expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                });

            });

            describe('when section is selected', function () {

                describe('and when course not found in dataContext', function () {

                    beforeEach(function () {
                        dataContext.courses = [];
                        var course = {
                            id: 1,
                            sections: [
                                {
                                    id: 1
                                }, {
                                    id: 2
                                }
                            ]
                        };
                        viewModel.selectedCourse(course);
                        viewModel.selectedSectionId(3);
                    });

                    it('should show notify error', function () {
                        viewModel.copyQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('courseIsNotAvailableAnyMore');
                        expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                    });

                });

                describe('and when section is not found in course', function () {

                    beforeEach(function () {
                        dataContext.courses = [{
                            id: 1,
                            sections: [{
                                id: 1
                            }, {
                                id: 2
                            }
                            ]
                        }
                        ];
                        viewModel.selectedCourse(dataContext.courses[0]);
                        viewModel.selectedSectionId(3);
                    });

                    it('should show notify error', function () {
                        viewModel.copyQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('sectionHasBeenDisconnectedByCollaborator');
                        expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                    });

                });

                describe('and when section is not found dataContext sections', function () {

                    beforeEach(function () {
                        var allobjs = [
                            {
                                id: 1
                            }, {
                                id: 2
                            }
                        ];
                        dataContext.sections = allobjs;
                        viewModel.allSections(allobjs);
                        viewModel.selectedSectionId(3);
                        viewModel.selectedCourse(allobjs);
                    });

                    it('should show notify error', function () {
                        viewModel.copyQuestion();
                        expect(localizationManager.localize).toHaveBeenCalledWith('sectionHasBeenDisconnectedByCollaborator');
                        expect(notify.error).toHaveBeenCalledWith(allSectionsTitle);
                    });

                });

            });

        });

        describe('when selected section is valid', function () {
            var allobjs;
            beforeEach(function () {
                allobjs = [{ id: 1 }, { id: 2 }];
                dataContext.courses = [{
                    id: 1,
                    sections: [{
                        id: 1
                    }, {
                        id: 2
                    }]
                }];
                dataContext.sections = allobjs;
                viewModel.allSections(allobjs);
                viewModel.selectedSectionId(1);
                viewModel.selectedCourse(dataContext.courses[0]);
            });

            it('should send event \'Copy item\'', function () {
                viewModel.copyQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy item');
            });

            it('should call copyQuestion from repository', function () {
                viewModel.copyQuestion();
                expect(questionRepository.copyQuestion).toHaveBeenCalledWith(viewModel.questionId, viewModel.selectedSectionId());
            });

            describe('and when question was copy', function () {
                var newQuestionId;

                beforeEach(function () {
                    newQuestionId = 'newQuestionId';
                    copyQuestionDefer.resolve({ id: newQuestionId });
                });

                it('should close popup', function (done) {
                    viewModel.copyQuestion();

                    copyQuestionDefer.promise.fin(function () {
                        expect(dialog.close).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

    });

});
