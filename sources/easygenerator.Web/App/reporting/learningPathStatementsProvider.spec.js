define(['reporting/learningPathStatementsProvider'], function(provider) {
    'use strict';

    var xApiProvider = require('reporting/xApiProvider');

    var learningPathId = 'learningPathId';


    describe('learningPathStatementsProvider:', function() {
        it('should be object', function() {
            expect(provider).toBeObject();
        });

        describe('getLrsStatements:', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(xApiProvider, 'getLearningPathFinishedStatements').and.returnValue(defer.promise);
            });

            it('should be function', function() {
                expect(provider.getLrsStatements).toBeFunction();
            });

            it('should return promise', function() {
                expect(provider.getLrsStatements()).toBePromise();
            });

            it('should get learning path finished statements', function() {
                provider.getLrsStatements(learningPathId, 5, 0);
                expect(xApiProvider.getLearningPathFinishedStatements).toHaveBeenCalledWith(learningPathId, 5, 0);
            });

            describe('when getLearningPathFinishedStatements is failed', function () {
                beforeEach(function() {
                    defer.reject();
                });

                it('should be rejected', function(done) {
                    var promise = provider.getLrsStatements(learningPathId, 5, 0);

                    promise.fin(function() {
                        expect(promise).toBeRejected();
                        done();
                    });
                });
            });

            describe('when getLearningPathFinishedStatements is succed', function () {
                var statements = [{id:'1'}, {id:'2'}];

                beforeEach(function () {
                    defer.resolve(statements);
                });

                it('should be resolved with finished statements', function() {
                    var promise = provider.getLrsStatements(learningPathId, 5, 0);

                    promise.fin(function() {
                        expect(promise).toBeResolvedWith({ finished: statements });
                        done();
                    });
                });
            });
        });
    });
});