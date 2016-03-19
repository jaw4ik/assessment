import ko from 'knockout';
import _ from 'underscore';
import notify from 'notify';
import dataContext from 'dataContext';
import eventTracker from 'eventTracker';
import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import permanentlyDeleteSectionCommand from 'editor/course/commands/permanentlyDeleteSectionCommand';
import unrelateSectionCommand from 'editor/course/commands/unrelateSectionCommand';

let events = {
    deleteSection: 'Delete selected objectives'
};

let eventCategory = 'Course editor (drag and drop)';

class DeleteSection {
    constructor() {
        this.courseId = '';
        this.courses = ko.observableArray([]);
        this.sectionId = '';
        this.sectionCreatedBy = '';
        this.sectionTitle = ko.observable('');
        this.sectionContainedInFewCourses = ko.computed(() => this.courses().length > 1);
        this.deleteEverywhere = ko.observable(false);
        this.isDeleting = ko.observable(false);
    }
    show(courseId, sectionId, sectionTitle, createdBy) {
        this.courseId = courseId;
        this.sectionId = sectionId;
        this.sectionTitle = sectionTitle;
        this.sectionCreatedBy = createdBy;

        this.courses(_.filter(dataContext.courses, course => {
            return _.some(course.sections, section => section.id === sectionId);
        }));

        dialog.show(this, constants.dialogs.deleteItem.settings);
    }
    async deleteSection() {
        eventTracker.publish(events.deleteSection, eventCategory);
        this.isDeleting(true);
        if ((this.deleteEverywhere() || !this.sectionContainedInFewCourses()) && userContext.identity.email === this.sectionCreatedBy) {
            await permanentlyDeleteSectionCommand.execute(this.sectionId);
        } else {
            await unrelateSectionCommand.execute(this.courseId, { id: this.sectionId });
        }
        this.isDeleting(false);
        notify.success(localizationManager.localize('sectionWasDeletedMessage'));
        dialog.close();
    }
    cancel() {
        dialog.close();
    }
    toggleDeleteEverywhere() {
        this.deleteEverywhere(!this.deleteEverywhere());
    }
}

export default new DeleteSection();