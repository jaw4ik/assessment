import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import guard from 'guard';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import router from 'routing/router';
import notify from 'notify';
import Comment from 'review/comments/Comment';
import CommentModel from 'models/comment';
import localizationManager from 'localization/localizationManager';
import getCourseCommentsCommand from 'review/commands/getCourseComments';
import deleteCommentCommand from 'review/commands/deleteComment';
import restoreCommentCommand from 'review/commands/restoreComment';

class CourseComments {
    constructor() {
        this.courseId = null;
        this.isLoading = ko.observable();
        this.comments = ko.observableArray([]);
        this.hasAccessToComments = ko.observable(userContext.hasStarterAccess());
        this._commentDeletedProxy = this.commentDeletedByCollaborator.bind(this);
        this._commentCreatedProxy = this.commentCreatedByCollaborator.bind(this);
    }
        
    async initialize(courseId) {
        this.isLoading(true);

        guard.throwIfNotString(courseId, 'Course id is not a string');
        this.courseId = courseId;
        app.on(constants.messages.course.comment.deletedByCollaborator + this.courseId, this._commentDeletedProxy);
        app.on(constants.messages.course.comment.createdByCollaborator + this.courseId, this._commentCreatedProxy);

        try {
            await userContext.identify();
            this.hasAccessToComments(userContext.hasStarterAccess());
            if (userContext.hasStarterAccess()) {
                let comments = await getCourseCommentsCommand.execute(courseId);
                this.comments(_.chain(comments)
                    .sortBy(item => { return -item.createdOn; })
                    .map(item => {
                        return new Comment(courseId, item);
                    }).value()
                );

                this.isLoading(false);
            }else{
                this.isLoading(false);
            }
        } catch (error) {
            notify.error(error);
            this.isLoading(false);
        }
    }

    tearDown(){
        app.off(constants.messages.course.comment.deletedByCollaborator + this.courseId, this._commentDeletedProxy);
        app.off(constants.messages.course.comment.createdByCollaborator + this.courseId, this._commentCreatedProxy);
    }

    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.externalReview);
        router.openUrl(constants.upgradeUrl);
    }

    async removeComment(comment) {
        try {
            await deleteCommentCommand.execute(this.courseId, comment.id).then((success) => {
                if (success) {
                    comment.isDeleted(true);
                    notify.saved();
                } else {
                    throw "Comment is not deleted";
                }
            });
        } catch (error) {
            notify.error(localizationManager.localize('commentWasNotDeletedError'));
        };
    }

    async restoreComment(comment) {
        try {
            await restoreCommentCommand.execute(this.courseId, new CommentModel({
                text: comment.text,
                name: comment.name,
                email: comment.email,
                createdOn: comment.createdOn,
                context: comment.originalContext
            })).then((restoredId) => {
                if (!_.isNull(restoredId) && !_.isUndefined(restoredId)) {
                    comment.isDeleted(false);
                    comment.id = restoredId;
                    notify.saved();
                } else {
                    throw "Comment is not restored";
                }
            });
        } catch (error){
            notify.error(localizationManager.localize('commentWasNotRestoredError'));
        };
    }

    commentDeletedByCollaborator(commentId) {
        this.deleteFromViewModel(commentId);
    }

    commentCreatedByCollaborator(commentData) {
        let comment = new Comment(this.courseId, commentData);
        let collection = this.comments();
        collection.push(comment);
        this.comments(_.chain(collection).sortBy(item => { return -item.createdOn; }).value());
    }

    hide(comment) {
        this.deleteFromViewModel(comment.id);
    }

    deleteFromViewModel(commentId) {
        this.comments(_.reject(this.comments(), (item) => {
            return item.id === commentId;
        }));
    }
}

export default new CourseComments();