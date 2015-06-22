define(['dialogs/learningPath/commands/deleteLearningPathCommand'], function (command) {
    "use strict";
    var
        httpWrapper = require('http/apiHttpWrapper'),
        dataContext = require('dataContext')
    ;

    describe('dialogs learning path [deleteLearningPathCommand]', function () {

        describe('execute:', function () {

            var dfd = Q.defer(),
                learningPath = {
                    id: 'id',
                    title: 'title'
                };
            beforeEach(function () {
                spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should send request to the server to delete learning path', function (done) {
                dfd.resolve();
                command.execute(learningPath.id).fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/delete', { learningPathId: learningPath.id });
                    done();
                });
            });

            describe('when learning path deleted successfully', function () {
                beforeEach(function () {
                    dataContext.learningPaths = [learningPath];
                    dfd.resolve();
                });

                it('should delete learning path from data context', function (done) {
                    command.execute(learningPath.id).fin(function () {
                        expect(dataContext.learningPaths.length).toBe(0);
                        done();
                    });

                });
            });

        });
    });
});