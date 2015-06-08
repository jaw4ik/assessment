define(['viewmodels/learningPaths/learningPaths/learningPathBrief'], function (ctor) {
    "use strict";
    var
         router = require('plugins/router'),
         eventTracker = require('eventTracker')
    ;

    describe('viewModel [learningPathBrief]', function () {
        var learningPath = {
                id: 'id',
                title: 'title',
                createdOn: new Date()
            },
            viewModel;

        beforeEach(function () {
            spyOn(router, 'navigate');
            spyOn(eventTracker, 'publish');
            viewModel = ctor(learningPath);
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(viewModel.title()).toBe(learningPath.title);
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBe(learningPath.id);
            });
        });

        describe('createdOn:', function () {
            it('should be defined', function () {
                expect(viewModel.createdOn).toBe(learningPath.createdOn);
            });
        });

        describe('navigateToDetails:', function () {
            it('should be publish event \'Navigate to learning path details\'', function () {
                viewModel.navigateToDetails();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to learning path details');
            });

            it('should navigate to learning path details', function () {
                viewModel.navigateToDetails();
                expect(router.navigate).toHaveBeenCalledWith('learningpaths/' + viewModel.id);
            });
        });
    });

});