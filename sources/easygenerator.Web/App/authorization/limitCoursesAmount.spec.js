define(['authorization/limitCoursesAmount'], function (viewModel) {
    "use strict";

    var userContext = require('userContext'),
        dataContext = require('dataContext');

    describe('viewModel [limitCoursesAmount]', function () {

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('checkAccess:', function () {

            it('should be function', function() {
                expect(viewModel.checkAccess).toBeFunction();
            });

            describe('when user has started access', function() {

                beforeEach(function() {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                });

                describe('and course amount exceeds starter limit', function() {

                    beforeEach(function() {
                        var courses = [];
                        _.times(55, function (n) {
                            courses.push(n);
                        });
                        dataContext.courses = courses;
                    });

                    it('should return false', function() {
                        expect(viewModel.checkAccess()).toBeFalsy();
                    });

                });

                describe('and course amount is less then starter limit', function () {
                    
                    beforeEach(function () {
                        dataContext.courses = [];
                    });

                    it('should return true', function () {
                        expect(viewModel.checkAccess()).toBeTruthy();
                    });

                });

            });

            describe('when user has no starter access', function() {
                

                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                });

                describe('and course amount exceeds free limit', function () {

                    beforeEach(function () {
                        var courses = [];
                        _.times(11, function (n) {
                            courses.push(n);
                        });
                        dataContext.courses = courses;
                    });

                    it('should return false', function () {
                        expect(viewModel.checkAccess()).toBeFalsy();
                    });

                });

                describe('and course amount is less then free limit', function () {

                    beforeEach(function () {
                        dataContext.courses = [];
                    });

                    it('should return true', function () {
                        expect(viewModel.checkAccess()).toBeTruthy();
                    });

                });

            });

        });

    });

});