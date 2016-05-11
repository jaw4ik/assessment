import command from 'review/commands/getCourseComments';

import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';
import commentMapper from 'mappers/commentModelMapper';

describe('review commands [getCourseComments]', () => {

    describe('execute:', () => {

        let course = {
            id: 'courseId'
        },
            comment = {
                id: 'id',
                text: 'text',
                email:'email',
                name: 'name',
                createdOn: new Date()
            }, getCommentsPromise;

        beforeEach(() => {
            getCommentsPromise = Promise.resolve({ Comments: [comment] });
            spyOn(http, 'post').and.returnValue(getCommentsPromise);
            spyOn(commentMapper, 'map').and.returnValue(comment);
        });

        describe('when course is not found', () => {
            beforeEach(() => {
                dataContext.courses = [];
            });

            it('should reject promise', done => (async () => {
                await command.execute(course.id);
            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });

        describe('when course comments are defined', () => {
            beforeEach(() => {
                dataContext.courses = [course];
                course.comments = [];
            });

            it('should return course comments', done => {
                command.execute(course.id).then((data) => {
                    expect(data).toBe(course.comments);
                    done();
                });
            });
        });

        describe('when course comments are not defined', () => {
            beforeEach(() => {
                dataContext.courses = [course];
                course.comments = undefined;
            });

            it('should send request to get course comments', () => {
                command.execute(course.id);
                expect(http.post).toHaveBeenCalledWith('api/comments', { courseId: course.id });
            });

            it('should set course comments', done => (async () => {
                command.execute(course.id);
                await getCommentsPromise;
                expect(dataContext.courses[0].comments.length).toBe(1);
            })().then(done));
        });

    });
    
});