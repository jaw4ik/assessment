import viewModel from 'review/comments/courseComments';

import ko from 'knockout';
import app from 'durandal/app';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import constants from 'constants';
import notify from 'notify';
import CommentModel from 'models/comment';
import localizationManager from 'localization/localizationManager';
import getCourseCommentsCommand from 'review/commands/getCourseComments';
import deleteCommentCommand from 'review/commands/deleteComment';
import restoreCommentCommand from 'review/commands/restoreComment';

describe('review [course comments]', () => {

    beforeEach(() => {
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(app, 'on');
        spyOn(app, 'off');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg;
        });
    });

    it('should be object', () => {
        expect(viewModel).toBeObject();
    });

    describe('isLoading:', () => {

        it('should be observable', () => {
            expect(viewModel.isLoading).toBeObservable();
        });

    });

    describe('comments:', () => {

        it('should be observable', () => {
            expect(viewModel.comments).toBeObservableArray();
        });

    });

    describe('initialize:', () => {

        it('should set isLoading flag to true', done => (async () => {
            var commentsPromise = Promise.resolve({});
            spyOn(getCourseCommentsCommand, 'execute').and.returnValue(commentsPromise);
            spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
            spyOn(viewModel, 'isLoading');
            viewModel.isLoading(false);

            await viewModel.initialize('123');
            expect(viewModel.isLoading).toHaveBeenCalledWith(true);
        })().then(done));

        describe('when courseId is not a string', () => {
            it('should reject promise', done => {
                viewModel.initialize({}).catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
            });
        });

        describe('when courseId is a string', () => {
            let courseId = '123', getCommentsDefer;

            beforeEach(() => {
                getCommentsDefer = Q.defer();
                spyOn(getCourseCommentsCommand, 'execute').and.returnValue(getCommentsDefer.promise);
            });

            it('should subscribe on comment deleted event', done => (async () => {
                await viewModel.initialize(courseId);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.comment.deletedByCollaborator + courseId, viewModel._commentDeletedProxy);
            })().then(done));

            it('should subscribe on comment created event', done => (async () => {
                await viewModel.initialize(courseId);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.comment.createdByCollaborator + courseId, viewModel._commentCreatedProxy);
            })().then(done));

            it('should update hasAccessToComments', done => {
                spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                viewModel.hasAccessToComments(true);

                viewModel.initialize('123').then(() => {
                    expect(viewModel.hasAccessToComments()).toBeFalsy();
                    done();    
                });
            });

            describe('and user has no starter access', () => {
                beforeEach(() => {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                });

                it('should not receive comments from repository', done => {
                    viewModel.initialize('123').then(() => {
                        expect(getCourseCommentsCommand.execute).not.toHaveBeenCalled();
                        done();    
                    });
                });
            });

            describe('and user has starter access', () => {
                let comment = {
                    id: 'id',
                    text: 'text',
                    name: 'name',
                    email: 'email',
                    createdOn: new Date(2016, 12, 21)
                },
                    oldComment = {
                        id: 'id2',
                        text: 'text',
                        name: 'name',
                        email: 'email',
                        createdOn: new Date(2015, 12, 21)
                    };

                beforeEach(() => {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                });

                it('should receive comments', done => {
                    getCommentsDefer.resolve([]);
                    viewModel.initialize('123').then(() => {
                        expect(getCourseCommentsCommand.execute).toHaveBeenCalledWith('123');
                        done();
                    });
                });

                describe('and comments received', () => {
                    beforeEach(() => {
                        getCommentsDefer.resolve([oldComment, comment]);
                    });

                    it('should update comments in viewModel', done => {
                        viewModel.comments([]);
                        viewModel.initialize('123').then(() => {
                            expect(viewModel.comments().length).toBe(2);
                            done();    
                        });
                    });

                    it('should order comments', done => {
                        viewModel.comments([]);
                        viewModel.initialize('123').then(() => {
                            expect(viewModel.comments()[0].id).toBe(comment.id);
                            expect(viewModel.comments()[1].id).toBe(oldComment.id);
                            done();    
                        });
                    });

                    it('should set isLoading to false', done => {
                        viewModel.isLoading(true);
                        viewModel.initialize('123').then(() => {
                            expect(viewModel.isLoading()).toBeFalsy();
                            done();    
                        });
                    });
                });

                describe('and comments not received', () => {
                    beforeEach(() => {
                        getCommentsDefer.reject();
                    });

                    it('should set isLoading to false', done => {
                        viewModel.isLoading(true);
                        viewModel.initialize('123').then(() => {
                            expect(viewModel.isLoading()).toBeFalsy();
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('tearDown:', () => {
        let courseId = '123';
        beforeEach(() => {
            viewModel.courseId = courseId;
        });

        it('should unsubscribe from app event \'course.comment.deletedByCollaborator\'', () => {
            viewModel.tearDown();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.comment.deletedByCollaborator + courseId, viewModel._commentDeletedProxy);
        });

        it('should unsubscribe from app event \'course.comment.createdByCollaborator\'', () => {
            viewModel.tearDown();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.comment.createdByCollaborator + courseId, viewModel._commentCreatedProxy);
        });
    });

    describe('hasAccessToComments:', () => {

        it('should be observable', () => {
            expect(viewModel.hasAccessToComments).toBeObservable();
        });

    });

    describe('openUpgradePlanUrl:', () => {

        beforeEach(() => {
            spyOn(eventTracker, 'publish');
            spyOn(window, 'open');
        });

        it('should send event \'Upgrade now\'', () => {
            viewModel.openUpgradePlanUrl();
            expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.externalReview);
        });

        it('should open upgrade link in new window', () => {
            viewModel.openUpgradePlanUrl();
            expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
        });

    });

    describe('removeComment:', () => {
        let comment = {
            id: 'commentId',
            isDeleted: ko.observable(false)
        },
            courseId = 'courseId',
            promise;

        beforeEach(() => {
            viewModel.courseId = courseId;
        });

        it('should call delete command', done => (async () => {
            promise = Promise.resolve(true);
            spyOn(deleteCommentCommand, 'execute').and.returnValue(promise);

            await viewModel.removeComment(comment);

            expect(deleteCommentCommand.execute).toHaveBeenCalledWith(courseId, comment.id);

        })().then(done));

        describe('when comment deleted successfully', () => {
            beforeEach(() => {
                promise = Promise.resolve(true);
                spyOn(deleteCommentCommand, 'execute').and.returnValue(promise);
            });

            it('should mark comment as deleted', done => (async () => {
                comment.isDeleted(false);

                await viewModel.removeComment(comment);

                expect(comment.isDeleted()).toBeTruthy();
                
            })().then(done));

            it('should show saved message', done => (async () => {
                await viewModel.removeComment(comment);

                expect(notify.saved).toHaveBeenCalled();
                
            })().then(done));
        });

        describe('when comment was not deleted successfully', () => {
            beforeEach(() => {
                promise = Promise.resolve(false);
                spyOn(deleteCommentCommand, 'execute').and.returnValue(promise);
            });

            it('should show error message', done => (async () => {
                await viewModel.removeComment(comment);

                expect(notify.error).toHaveBeenCalledWith('commentWasNotDeletedError');
                
            })().then(done));
        });

        describe('when delete comment failed', () => {
            beforeEach(() => {
                promise = Promise.reject();
                spyOn(deleteCommentCommand, 'execute').and.returnValue(promise);
            });

            it('should show error message', done => (async () => {
                await viewModel.removeComment(comment);

                expect(notify.error).toHaveBeenCalledWith('commentWasNotDeletedError');
                
            })().then(done));
        });
    });

    describe('restoreComment:', () => {
        let comment = {
            id: 'commentId',
            isDeleted: ko.observable(false),
            text: 'commentText',
            name: 'commentName',
            email: 'commentEmail',
            createdOn: new Date(),
            originalContext: null
        },
            courseId = 'courseId',
            promise;

        beforeEach(() => {
            viewModel.courseId = courseId;
        });

        it('should call restore comment command', done => (async () => {
            promise = Promise.resolve(true);
            spyOn(restoreCommentCommand, 'execute').and.returnValue(promise);

            await viewModel.restoreComment(comment);

            expect(restoreCommentCommand.execute).toHaveBeenCalledWith(courseId, new CommentModel({
                text: comment.text,
                name: comment.name,
                email: comment.email,
                createdOn: comment.createdOn,
                context: comment.originalContext
            }));

        })().then(done));

        describe('when comment restored successfully', () => {
            let restoredCommentId = 'restoredId';

            beforeEach(() => {
                promise = Promise.resolve(restoredCommentId);
                spyOn(restoreCommentCommand, 'execute').and.returnValue(promise);
            });

            it('should remove comment is deleted mark', done => (async () => {
                comment.isDeleted(true);

                await viewModel.restoreComment(comment);

                expect(comment.isDeleted()).toBeFalsy();
                
            })().then(done));

            it('should update comment id', done => (async () => {
                comment.id = 'id';

                await viewModel.restoreComment(comment);

                expect(comment.id).toBe(restoredCommentId);
                
            })().then(done));

            it('should show saved message', done => (async () => {
                await viewModel.restoreComment(comment);

                expect(notify.saved).toHaveBeenCalled();
                
            })().then(done));
        });

        describe('when comment was not restored successfully', () => {
            beforeEach(() => {
                promise = Promise.resolve();
                spyOn(restoreCommentCommand, 'execute').and.returnValue(promise);
            });

            it('should show error message', done => (async () => {
                await viewModel.restoreComment(comment);

                expect(notify.error).toHaveBeenCalledWith('commentWasNotRestoredError');
                
            })().then(done));
        });

        describe('when restore comment failed', () => {
            beforeEach(() => {
                promise = Promise.reject();
                spyOn(restoreCommentCommand, 'execute').and.returnValue(promise);
            });

            it('should show error message', done => (async () => {
                await viewModel.restoreComment(comment);

                expect(notify.error).toHaveBeenCalledWith('commentWasNotRestoredError');
                
            })().then(done));
        });
    });

    describe('commentDeletedByCollaborator:', () => {
        let commentId = '1',
            courseId = 'courseId',
            comment = {
                id: commentId,
                text: 'text',
                name: 'name',
                email: 'email',
                createdOn: '2015-12-10',
                isDeleted: ko.observable(false)
            };

        describe('when courseId is correct', () => {
            it('should remove comment from viewModel', () => {
                viewModel.courseId = courseId;
                viewModel.comments([comment]);
                viewModel.commentDeletedByCollaborator(commentId);
                expect(viewModel.comments().length).toBe(0);
            });
        });

        describe('when courseId is not correct', () => {
            it('should not remove comment from viewModel', () => {
                viewModel.courseId = courseId;
                viewModel.comments([comment]);

                viewModel.commentDeletedByCollaborator('someId');
                expect(viewModel.comments().length).toBe(1);
            });
        });

    });

    describe('commentCreatedByCollaborator:', () => {
        let comment = {
            id: 'id',
            text: 'text',
            name: 'name',
            email: 'email',
            createdOn: new Date(2016, 12, 21)
        },
            existingComment = {
                id: 'id2',
                text: 'text',
                name: 'name',
                email: 'email',
                createdOn: new Date(2015, 12, 21)
            };

        beforeEach(() => {
            viewModel.comments([existingComment]);
        });

        it('should add comment view model to comments collection', () => {
            viewModel.commentCreatedByCollaborator(comment);
            expect(viewModel.comments().length).toBe(2);
        });

        it('should order comments by created on date', () => {
            viewModel.commentCreatedByCollaborator(comment);
            expect(viewModel.comments()[0].id).toBe(comment.id);
            expect(viewModel.comments()[1].id).toBe(existingComment.id);
        });
    });

    describe('hide:', () => {
        let comment = {
            id: ko.observable('1'),
            text: 'text',
            name: 'name',
            email: 'email',
            createdOn: '2015-12-10',
            isDeleted: ko.observable(false)
        };

        it('should remove comment from viewModel', () => {
            viewModel.comments([comment]);

            viewModel.hide(comment);
            expect(viewModel.comments().length).toBe(0);
        });
    });
});