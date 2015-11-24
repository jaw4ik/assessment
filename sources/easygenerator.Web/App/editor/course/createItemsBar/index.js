import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import router from 'plugins/router';

export default class {
    constructor() {
        this.sectionExpanded = ko.observable(true);
        this.questionsExpanded = ko.observable(true);
        this.questions = [
            {
                type: constants.questionType.informationContent.type,
                hasAccess: true
            },
            {
                type: constants.questionType.singleSelectText.type,
                hasAccess: true
            },
            {
                type: constants.questionType.multipleSelect.type,
                hasAccess: true
            },
            {
                type: constants.questionType.singleSelectImage.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.fillInTheBlank.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.textMatching.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.dragAndDropText.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.statement.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.hotspot.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.openQuestion.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.scenario.type,
                hasAccess: userContext.hasAcademyAccess()
            }
        ];
    }
    toggleSection() {
        this.sectionExpanded(!this.sectionExpanded());
    }
    toggleQuestions() {
        this.questionsExpanded(!this.questionsExpanded());
    }
    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.questions);
        router.openUrl(constants.upgradeUrl);
    }
    activate() {
        this.sectionExpanded(true);
        this.questionsExpanded(true);
    }
}