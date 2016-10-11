import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';

import viewModel from './index';
import {CourseExamplesDialog} from './index';

describe('[add course by example dialog]', () => {
    beforeEach(() => {
        spyOn(dialog, 'show');
    });

    describe('ctor:', () => {
        it('should define courseExamplesViewModel as CourseExamplesDialog', () => {
            expect(viewModel.courseExamplesViewModel).toEqual(jasmine.any(CourseExamplesDialog));
        });
    });

    describe('show:', () => {
        it('should call dialog show', () => {
            viewModel.show();
            
            expect(dialog.show).toHaveBeenCalled();
            expect(dialog.show.calls.mostRecent().args[1]).toBe(constants.dialogs.addCourseByExamples.settings);
        });
    });
});