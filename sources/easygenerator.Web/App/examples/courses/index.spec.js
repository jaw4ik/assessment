import localizationManager from 'localization/localizationManager';
import getCourseExamplesCommand from 'examples/courses/commands/getCourseExamples';
import createCourseByExampleCommand from 'examples/courses/commands/createCourseByExample';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import eventTracker from 'eventTracker';
import router from 'routing/router';

import {CourseExamples} from 'examples/courses/index';

describe('examples [CourseExamples]', () => {
    let viewModel,
        course1 = { id: 'course1', title: 'course1 title', category: 'popular' },
        course2 = { id: 'course2', title: 'course2 title', category: 'corporate' };
    
    beforeEach(() => {
        spyOn(localizationManager, 'localize');
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
    });

    describe('ctor:', () => {

        describe('categories:', () => {
            it('should be set', () => {
                viewModel = new CourseExamples();
                expect(viewModel.categories).toBeArray();
                expect(viewModel.categories.length).toBe(4);
            });
        });

        describe('courses:', () => {
            it('should be set empty', () => {
                viewModel = new CourseExamples();
                expect(viewModel.courses()).toBeArray();
                expect(viewModel.courses().length).toBe(0);
            });
        });

        describe('selected:', () => {
            it('should be set to first category', () => {
                viewModel = new CourseExamples();
                expect(viewModel.selected()).toBe(viewModel.categories[0]);
            });
        });

        describe('examples:', () => {
            it('should filter courses by selected category', () => {
                viewModel = new CourseExamples();
                viewModel.courses([course1, course2]);

                expect(viewModel.examples()).toBeArray();
                expect(viewModel.examples().length).toBe(1);
                expect(viewModel.examples()[0]).toBe(course1);
            });
        });
    });

    describe('activate:', () => {
        it('should send request to get course examples', done => (async () => {
            spyOn(getCourseExamplesCommand, 'execute').and.returnValue(Promise.resolve(true));
                
            viewModel = new CourseExamples();
            await viewModel.activate();
                
            expect(getCourseExamplesCommand.execute).toHaveBeenCalled();
                
        })().then(done));

        describe('and when course examples received successfully', () => {
            it('should set courses', done => (async () => {
                spyOn(getCourseExamplesCommand, 'execute').and.returnValue(Promise.resolve([course1, course2]));
                
                viewModel = new CourseExamples();
                await viewModel.activate();
                
                expect(viewModel.courses()).toBeArray();
                expect(viewModel.courses().length).toBe(2);
                expect(viewModel.courses()[0]).toBe(course1);
                expect(viewModel.courses()[1]).toBe(course2);
                
            })().then(done));
        });
        
        describe('and when failed to create course by example', () => {
            
            beforeEach(() => {
                spyOn(getCourseExamplesCommand, 'execute').and.returnValue(Promise.reject('reason'));
            });

            it('should set courses to empty', done => (async () => {
                viewModel = new CourseExamples();
                await viewModel.activate();

            })().catch(reason => {
                expect(reason).toBeDefined();
                expect(viewModel.courses()).toBeArray();
                expect(viewModel.courses().length).toBe(0);

                done();
            }));
        });
    });

    describe('createByExample', () => {
        it('should publish \'Create a course from an example\' event', () => {
            spyOn(createCourseByExampleCommand, 'execute').and.returnValue(Promise.resolve());

            viewModel.createByExample(course1);
            expect(eventTracker.publish).toHaveBeenCalledWith('Create a course from an example', null, { Example_Course_Title: course1.title });
        });

        it('should execute command to create course by example', done => (async () => {
            spyOn(createCourseByExampleCommand, 'execute').and.returnValue(Promise.resolve(course1));

            await viewModel.createByExample(course1);

            expect(createCourseByExampleCommand.execute).toHaveBeenCalledWith(course1.id);

        })().then(done));

        describe('when course is created', () => {
            it('should execute command to create course by example', done => (async () => {
                spyOn(createCourseByExampleCommand, 'execute').and.returnValue(Promise.resolve(course1));

                await viewModel.createByExample(course1);

                expect(router.navigate).toHaveBeenCalledWith('courses/' + course1.id);

            })().then(done));
        });     

        describe('when failed to create course', () => {
            beforeEach(() => {
                spyOn(createCourseByExampleCommand, 'execute').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await viewModel.createByExample(course1);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));   
        });
    });

    describe('addFromScratch:', () => {
        beforeEach(() => {
            spyOn(createCourseDialog, 'show');
        });

        it('should publish \'Create a course from scratch\' event', () => {
            viewModel.addFromScratch();
            expect(eventTracker.publish).toHaveBeenCalledWith('Create a course from scratch');
        });

        it('should show createCourseDialog', () => {
            viewModel.addFromScratch();
            expect(createCourseDialog.show).toHaveBeenCalled();
        });
    });
});