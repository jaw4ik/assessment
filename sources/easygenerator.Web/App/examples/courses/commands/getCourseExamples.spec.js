import _ from 'underscore';
import http from 'http/apiHttpWrapper';
import dataContext from 'dataContext';
import command from 'examples/courses/commands/getCourseExamples';


describe('examples commands [getCourseExamples]', () => {

    describe('execute:', () => {
        var courseData = [{ id: 'id' }];

        describe('when there are no examples in dataContext', () => {
            beforeEach(() => {
                dataContext.courseExamples = null;    
            });

            it('should send request to get course examples', done => (async () => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
                await command.execute();
                
                expect(http.post).toHaveBeenCalledWith('api/examples/courses');
                
            })().then(done));

            describe('and when course examples received successfully', () => {
                beforeEach(() => {
                    spyOn(http, 'post').and.returnValue(Promise.resolve(courseData));
                });

                it('should return course examples collection', done => (async () => {
                    var examples = await command.execute();

                    expect(examples.length).toBe(1);
                    expect(examples[0].id).toBe(courseData[0].id);
                })().then(done));
            });

            describe('and when failed to get course examples', () => {
            
                beforeEach(() => {
                    spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
                });

                it('should reject promise', done => (async () => {
                    await command.execute();

                })().catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                }));
            });
        });

        describe('when there are examples in dataContext', () => {
            beforeEach(() => {
                dataContext.courseExamples = courseData;
            });

            it('should return examples from dataContext', done => (async () => {
                var courses = await command.execute();
                expect(courses).toBe(courseData);
                
            })().then(done));
        });
    });
});
