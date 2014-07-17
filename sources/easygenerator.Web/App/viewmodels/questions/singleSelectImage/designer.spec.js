define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/singleSelectImage/designer');


    describe('question [designer]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('toggleExpand:', function () {
            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            describe('when isExpanded true', function () {
                it('should set isExpanded to true', function () {
                    viewModel.isExpanded(true);
                    viewModel.toggleExpand();
                    expect(viewModel.isExpanded()).toBeFalsy();
                });
            });

            describe('when isExpanded false', function () {
                it('should set isExpanded to false', function () {
                    viewModel.isExpanded(false);
                    viewModel.toggleExpand();
                    expect(viewModel.isExpanded()).toBeTruthy();
                });
            });
        });
    });
});