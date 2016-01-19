define(['dialogs/learningPath/commands/deleteLearningPathCommand'], function (command) {
    "use strict";
    var
        httpWrapper = require('http/apiHttpWrapper'),
        dataContext = require('dataContext')
    ;

    describe('dialogs learning path [deleteLearningPathCommand]', function () {

        describe('execute:', function () {

            var dfd,
                learningPath = {
                    id: 'id',
                    title: 'title'
                };
            beforeEach(function () {
                dfd = Q.defer();
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
                });

                describe('and learning path has related documents', function () {

                    beforeEach(function () {
                        dataContext.documents = [{ id: '123' }, { id: '124' }];
                        dfd.resolve({ deletedDocumentIds: ['123', '124'] });
                    });

                    it('should delete documents from dataContext', function (done) {
                        command.execute(learningPath.id).fin(function () {
                            expect(dataContext.documents.length).toBe(0);
                            done();
                        });
                    });

                });

                it('should delete learning path from data context', function (done) {
                    dfd.resolve();
                    command.execute(learningPath.id).fin(function () {
                        expect(dataContext.learningPaths.length).toBe(0);
                        done();
                    });

                });
            });

        });
    });
});