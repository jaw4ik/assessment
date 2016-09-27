import presentationCourseImportCommand from 'commands/presentationCourseImportCommand';
import uiLocker from 'uiLocker';
import router from 'routing/router';

import viewModel from 'importfrompresentation/index';

describe('[import from presentation]', () => {
    beforeEach(function () {
        spyOn(router, 'navigate');
        spyOn(router, 'replace');
        spyOn(uiLocker, 'lock');
        spyOn(uiLocker, 'unlock');
    });

    describe('importCourseFromPresentation:', function () {

        it('should be a function', function () {
            expect(viewModel.importCourseFromPresentation).toBeFunction();
        });

        it('should execute import course command', function () {
            spyOn(presentationCourseImportCommand, 'execute');
            viewModel.importCourseFromPresentation();
            expect(presentationCourseImportCommand.execute).toHaveBeenCalled();
        });

        describe('when course import started', function () {
            beforeEach(function () {
                spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                    spec.startLoading();
                });
            });

            it('should unlock ui', function () {
                viewModel.importCourseFromPresentation();
                expect(uiLocker.lock).toHaveBeenCalled();
            });
        });

        describe('when course import succeded', function () {
            var course = { id: 'id' };
            beforeEach(function () {
                spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                    spec.success(course);
                });
            });

            describe('and course has section', function () {
                beforeEach(function () {
                    course.sections = [{ id: 'sectionId' }];
                });

                it('should navigate to created course', function () {
                    viewModel.importCourseFromPresentation();
                    expect(router.navigate).toHaveBeenCalledWith('courses/' + course.id + '/sections/' + course.sections[0].id);
                });
            });

            describe('and course does not have sections', function () {
                beforeEach(function () {
                    course.sections = [];
                });

                it('should navigate to created course', function () {
                    viewModel.importCourseFromPresentation();
                    expect(router.navigate).toHaveBeenCalledWith('courses/' + course.id);
                });
            });

        });

        describe('when course import completed', function () {
            beforeEach(function () {
                spyOn(presentationCourseImportCommand, 'execute').and.callFake(function (spec) {
                    spec.complete();
                });
            });

            it('should unlock ui', function () {
                viewModel.importCourseFromPresentation();
                expect(uiLocker.unlock).toHaveBeenCalled();
            });
        });
    });
});