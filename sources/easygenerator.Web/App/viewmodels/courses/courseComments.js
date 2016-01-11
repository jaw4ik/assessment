import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import guard from 'guard';
import userContext from 'userContext';
import commentRepository from 'repositories/commentRepository';
import eventTracker from 'eventTracker';
import router from 'plugins/router';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';

class CourseComments {

    constructor() {
        this.courseId = null;
        this.isCommentsLoading = ko.observable();
        this.comments = ko.observableArray([]);
        this.hasAccessToComments = ko.observable(userContext.hasStarterAccess());
    }

        
    async activate(courseId) {
        let that = this;
        that.isCommentsLoading(true);
        try {
            guard.throwIfNotString(courseId, 'Course id is not a string');
            that.courseId = courseId;

            await userContext.identify();
            
            this.hasAccessToComments(userContext.hasStarterAccess());
            if (userContext.hasStarterAccess()) {

                let comments = await commentRepository.getCollection(courseId);
                that.comments(_.map(comments, (item) => {
                    return {
                        id: ko.observable(item.id),
                        text: item.text,
                        email: item.email,
                        name: item.name,
                        createdOn: item.createdOn,
                        isDeleted: ko.observable(false)
                    };
                }));
            }
        } catch (error) {
            notify.error(error);
        }

        that.isCommentsLoading(false);
    }

    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.externalReview);
        router.openUrl(constants.upgradeUrl);
    }

    removeComment(comment) {
        return commentRepository.removeComment(this.courseId, comment.id()).then((success) => {
            if (success) {
                comment.isDeleted(true);
                notify.saved();
            } else {
                throw "Comment is not deleted";
            }
        }).fail(() => {
            notify.error(localizationManager.localize('commentWasNotDeletedError'));
        });
    }

    restoreComment(comment) {
        return commentRepository.restoreComment(this.courseId, comment).then((restoredId) => {
            if (!_.isNull(restoredId) && !_.isUndefined(restoredId)) {
                comment.isDeleted(false);
                comment.id(restoredId);
                notify.saved();
            } else {
                throw "Comment is not restored";
            }
        }).fail(() => {
            notify.error(localizationManager.localize('commentWasNotRestoredError'));
        });
    }

    deletedByCollaborator(courseId, commentId) {
        if (this.courseId !== courseId) {
            return;
        }

        this.deleteFromViewModel(commentId);
    }

    hide(comment) {
        this.deleteFromViewModel(comment.id());
    }

    deleteFromViewModel(commentId) {
        this.comments(_.reject(this.comments(), (item) => {
            return item.id() === commentId;
        }));
    }
}

let viewModel = new CourseComments();
app.on(constants.messages.course.comment.deletedByCollaborator, viewModel.deletedByCollaborator.bind(viewModel));

export default viewModel;