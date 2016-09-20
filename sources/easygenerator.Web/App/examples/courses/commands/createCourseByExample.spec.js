import _ from 'underscore';
import http from 'http/apiHttpWrapper';
import command from 'examples/courses/commands/createCourseByExample';
import repository from 'repositories/courseRepository';

describe('examples commands [createCourseByExample]', () => {

    describe('execute:', () => {
        var course = { id: 'someId' },
            courseData = {
                course: course,
                sections: []
            };

        beforeEach(() => {
            spyOn(repository, 'updateCourseInDataContext').and.returnValue(course);
        });

        it('should send request to create course by example', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(course.id);
                
            expect(http.post).toHaveBeenCalledWith('api/course/duplicate', { courseId: course.id, hasSameName: true });
                
        })().then(done));

        describe('and when course created successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(courseData));
            });

            it('should update course data in repository', done => (async () => {
                await command.execute(course.id);

                expect(repository.updateCourseInDataContext).toHaveBeenCalledWith(courseData);
            })().then(done));

            it('should return created course', done => (async () => {
                var result = await command.execute(course.id);

                expect(result.id).toBe(course.id);
            })().then(done));
        });

        describe('and when failed to create course by example', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(course.id);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});