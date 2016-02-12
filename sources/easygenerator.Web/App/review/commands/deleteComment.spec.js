import command from 'review/commands/deleteComment';

import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';

describe('review commands [deleteComment]', () => {

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
            }, promise;

        describe('when course is not found', () => {
            beforeEach(() => {
                dataContext.courses = [];
            });

            it('should reject promise', done => (async () => {
                await command.execute(course.id, comment.id);

            })().catch(done));

        });

        describe('when course is found', () => {
            beforeEach(() => {
                dataContext.courses = [course];
            });

            it('should send request to delete course comments', () => {
                promise = Promise.resolve(true);
                spyOn(http, 'post').and.returnValue(promise);
                command.execute(course.id, comment.id);
                expect(http.post).toHaveBeenCalledWith('api/comment/delete', { courseId: course.id, commentId: comment.id});
            });

            it('should send request to delete course comments', done => (async () => {
                promise = Promise.resolve(true);
                spyOn(http, 'post').and.returnValue(promise);
                
                await command.execute(course.id, comment.id);
                
                expect(http.post).toHaveBeenCalledWith('api/comment/delete', { courseId: course.id, commentId: comment.id});
                
            })().then(done));

            describe('and when deleted successfully', () => {
                beforeEach(() => {
                    promise = Promise.resolve(true);
                    spyOn(http, 'post').and.returnValue(promise);
                });

                it('should delete comment from course comments', done => (async () => {
                    course.comments = [comment];

                    await command.execute(course.id, comment.id);

                    expect(dataContext.courses[0].comments.length).toBe(0);
                })().then(done));
            });
        });
    });
    
});