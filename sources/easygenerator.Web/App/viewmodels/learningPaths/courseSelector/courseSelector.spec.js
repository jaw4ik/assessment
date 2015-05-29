define(['viewmodels/learningPaths/courseSelector/courseSelector'], function (viewModel) {
    "use strict";

    var
        getOwnedCoursesQuery = require('viewmodels/learningPaths/courseSelector/queries/getOwnedCoursesQuery')
    ;


    describe('viewmodel learning path [courseSelector]', function () {

        beforeEach(function () {
        });

        describe('isExpanded:', function () {
            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });
        });

        describe('courses:', function() {
            it('should be observable array', function() {
                expect(viewModel.courses).toBeObservableArray();
            });
        });

        describe('expand:', function () {
            it('should set isExpanded to true', function () {
                viewModel.isExpanded(false);
                viewModel.expand();
                expect(viewModel.isExpanded()).toBeTruthy();
            });
        });

        describe('collapse:', function () {
            it('should set isExpanded to false', function () {
                viewModel.isExpanded(true);
                viewModel.collapse();
                expect(viewModel.isExpanded()).toBeFalsy();
            });
        });

        describe('activate:', function () {
            var defer,
                courses = [
                {
                    id: '0',
                    createdOn: new Date(1)
                },
                {
                    id: '0',
                    createdOn: new Date(1)
                }
                ];

            beforeEach(function () {
                defer = Q.defer();
                spyOn(getOwnedCoursesQuery, 'execute').and.returnValue(defer.promise);
            });

            describe('when courses retrieved', function () {
                beforeEach(function () {
                    defer.resolve(courses);
                });

                it('should set courses ordered by created on', function (done) {
                    viewModel.courses([]);
                    viewModel.activate().fin(function () {
                        expect(viewModel.courses().length).toBe(courses.length);
                        expect(viewModel.courses()[0].createdOn.toLocaleString()).toBe(courses[1].createdOn.toLocaleString());
                        expect(viewModel.courses()[1].createdOn.toLocaleString()).toBe(courses[0].createdOn.toLocaleString());
                        done();
                    });
                });
            });
        });

    });

});