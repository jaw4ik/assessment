﻿define(['synchronization/handlers/course/handler'], function (handler) {
    "use strict";

    describe('synchronization course [handler]', function () {

        describe('collaborationStarted', function () {
            it('should be function', function () {
                expect(handler.collaborationStarted).toBeFunction();
            });
        });

        describe('collaboratorAdded:', function () {
            it('should be function', function () {
                expect(handler.collaboratorAdded).toBeFunction();
            });
        });

        describe('titleUpdated:', function () {
            it('should be function', function () {
                expect(handler.titleUpdated).toBeFunction();
            });
        });

        describe('introductionContentUpdated:', function () {
            it('should be function', function () {
                expect(handler.introductionContentUpdated).toBeFunction();
            });
        });

        describe('templateUpdated:', function () {
            it('should be function', function () {
                expect(handler.templateUpdated).toBeFunction();
            });
        });

        describe('objectivesReordered:', function () {
            it('should be function', function () {
                expect(handler.objectivesReordered).toBeFunction();
            });
        });

        describe('published:', function () {
            it('should be function', function () {
                expect(handler.published).toBeFunction();
            });
        });

        describe('deleted:', function () {
            it('should be function', function () {
                expect(handler.deleted).toBeFunction();
            });
        });

        describe('objectiveRelated:', function () {
            it('should be function', function () {
                expect(handler.objectiveRelated).toBeFunction();
            });
        });

        describe('objectivesUnrelated:', function () {
            it('should be function', function () {
                expect(handler.objectivesUnrelated).toBeFunction();
            });
        });

    });

})