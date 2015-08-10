define(['dialogs/course/createCourse/createCourse'], function (viewModel) {
    var constants = require('constants'),
        courseTitleStep = require('dialogs/course/createCourse/steps/courseTitleStep'),
        courseTemplateStep = require('dialogs/course/createCourse/steps/courseTemplateStep'),
        dialog = require('widgets/dialogWizard/dialogWizard');

    describe('dialog course [createCourse]', function () {

        beforeEach(function () {
            spyOn(dialog, 'show');
        });

        describe('show:', function () {
            it('should call dialog show', function () {
                viewModel.show();
                expect(dialog.show).toHaveBeenCalled();
            });
        });
    });

});