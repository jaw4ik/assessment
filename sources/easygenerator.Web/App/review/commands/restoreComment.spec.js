import command from 'review/commands/restoreComment';

import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';

describe('review commands [restoreComment]', () => {

    describe('execute:', () => {

        let course = {
            id: 'courseId'
        },
            comment = {
                id: 'id',
                text: 'text',
                email: 'email',
                name: 'name',
                context: null,
                createdOn: new Date()
            },
            promise;

        describe('when course is not found', () => {
            beforeEach(() => {
                dataContext.courses = [];
            });

            it('should reject promise', done => (async () => {
                await command.execute(course.id, comment);
            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });

        describe('when course is found', () => {
            beforeEach(() => {
                dataContext.courses = [course];
            });

            it('should send request to restore course comments', done => (async () => {
                promise = Promise.resolve(true);
                spyOn(http, 'post').and.returnValue(promise);

                await  command.execute(course.id, comment);

                expect(http.post).toHaveBeenCalledWith('api/comment/restore', {
                    courseId: course.id,
                    text: comment.text,
                    createdByName: comment.name,
                    createdBy: comment.email,
                    createdOn: comment.createdOn,
                    context: comment.context ? JSON.stringify(comment.context) : comment.context
                }
                );

            })().then(done));

            describe('and when restored successfully', () => {
                beforeEach(() => {
                    promise = Promise.resolve(true);
                    spyOn(http, 'post').and.returnValue(promise);
                });

                it('should add comment to course comments', done => (async () => {
                    dataContext.courses[0].comments = [];
                    command.execute(course.id, comment);
                    await promise;
                    expect(dataContext.courses[0].comments.length).toBe(1);
                })().then(done));
            });
        });
    });
    
});