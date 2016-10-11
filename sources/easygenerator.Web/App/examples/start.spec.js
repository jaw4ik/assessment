import clientContext from 'clientContext';
import constants from 'constants';
import createCourseDialog from 'dialogs/course/createCourse/createCourse';
import router from 'routing/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

import {Start} from 'examples/start';

describe('examples [start]', () => {
    let viewModel;

    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake((key) => {
            return key;
        });
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
    });

    describe('ctor:', () => {
        beforeEach(() => {
            viewModel = new Start();
        });

        it('should create startFromScratchTutorial', () => {
            expect(viewModel.startFromScratchTutorial.title).toBe('startFromScratch');
        });

        it('should create showExamplesTutorial', () => {
            expect(viewModel.showExamplesTutorial.title).toBe('showExamples');
        });
    });

    describe('activate:', () => {
        it('should remove showCreateCourseView from client context', () => {
            spyOn(clientContext, 'remove');
            viewModel = new Start();
            viewModel.activate();
            expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.showCreateCourseView);
        });
    });

    describe('addFromScratch:', () => {
        beforeEach(() => {
            spyOn(createCourseDialog, 'show');
            viewModel = new Start();
        });

        it('should publish \'Create a course from scratch\' event', () => {
            viewModel.addFromScratch();
            expect(eventTracker.publish).toHaveBeenCalledWith('Create a course from scratch');
        });

        it('should show createCourseDialog', () => {
            viewModel.addFromScratch();
            expect(createCourseDialog.show).toHaveBeenCalled();
        });
    });

    describe('showExamples:', () => {
        it('should navigate to examples', () => {
            viewModel = new Start();
            viewModel.showExamples();
            expect(router.navigate).toHaveBeenCalledWith('start/examples');
        });
    });

    describe('watchStartFromScratch:', () => {
        it('should show startFromScratchTutorial', () => {
            let someVariable = '';
            viewModel = new Start();
            viewModel.startFromScratchTutorial.show = function() {
                someVariable = 'test';
            };
            viewModel.watchStartFromScratch();

            expect(someVariable).toBe('test');
        });
    });

    describe('watchShowExamples:', () => {
        it('should show showExamplesTutorial', () => {
            let someVariable = '';
            viewModel = new Start();
            viewModel.showExamplesTutorial.show = function() {
                someVariable = 'test';
            };
            viewModel.watchShowExamples();

            expect(someVariable).toBe('test');
        });
    });
});