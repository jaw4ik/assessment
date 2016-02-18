import CreateBar from './CreateBarViewModel';

import eventTracker from 'eventTracker';
import constants from 'constants';
import router from 'plugins/router';
import cursorTooltip from 'widgets/cursorTooltip/viewmodel';

describe('[CreateBarViewModel]', () => {
    let createBar;

    beforeEach(() => {
        createBar = new CreateBar();
    });

    it('should be function', () => {
        expect(CreateBar).toBeFunction();
    });

    it('should initialize fields', () => {
        expect(createBar.sectionExpanded()).toBeTruthy();
        expect(createBar.questionsExpanded()).toBeTruthy();
        expect(createBar.questions).toBeArray();
        expect(createBar.toggleSection).toBeFunction();
        expect(createBar.toggleQuestions).toBeFunction();
        expect(createBar.openUpgradePlanUrl).toBeFunction();
        expect(createBar.activate).toBeFunction();
    });

    describe('toggleSection:', () => {

        describe('when section shows', () => {

            it('should hide section', () => {
                createBar.sectionExpanded(true);
                createBar.toggleSection();
                expect(createBar.sectionExpanded()).toBeFalsy();
            });

        });

        describe('when section hidden', () => {

            it('should show section', () => {
                createBar.sectionExpanded(false);
                createBar.toggleSection();
                expect(createBar.sectionExpanded()).toBeTruthy();
            });

        });

    });

    describe('toggleQuestions:', () => {

        describe('when questions shows', () => {

            it('should hide questions', () => {
                createBar.questionsExpanded(true);
                createBar.toggleQuestions();
                expect(createBar.questionsExpanded()).toBeFalsy();
            });

        });

        describe('when questions hidden', () => {

            it('should show questions', () => {
                createBar.questionsExpanded(false);
                createBar.toggleQuestions();
                expect(createBar.questionsExpanded()).toBeTruthy();
            });

        });

    });

    describe('openUpgradePlanUrl:', () => {

        beforeEach(() => {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'openUrl');
        });

        it('should send event ' + constants.upgradeEvent, () => {
            createBar.openUpgradePlanUrl();
            expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.questions);
        });

        it('should open upgrage url', () => {
            createBar.openUpgradePlanUrl();
            expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
        });

    });

    describe('activate:', () => {

        it('should show section', () => {
            createBar.sectionExpanded(false);
            createBar.toggleSection();
            expect(createBar.sectionExpanded()).toBeTruthy();
        });

        it('should show questions', () => {
            createBar.questionsExpanded(false);
            createBar.toggleQuestions();
            expect(createBar.questionsExpanded()).toBeTruthy();
        });

    });

    describe('showQuestionTootip:', () => {

        it('should change tooltip text', () => {
            spyOn(cursorTooltip, 'changeText');
            createBar.showQuestionTootip();
            expect(cursorTooltip.changeText).toHaveBeenCalledWith('emptySectionQuestionTooltip');
        });

        it('should show tooltip', () => {
            spyOn(cursorTooltip, 'show');
            createBar.showQuestionTootip();
            expect(cursorTooltip.show).toHaveBeenCalled();
        });

    });

    describe('hideQuestionTootip:', () => {
        
        it('should hide tooltip', () => {
            spyOn(cursorTooltip, 'hide');
            createBar.hideQuestionTootip();
            expect(cursorTooltip.hide).toHaveBeenCalled();
        });

    });
});