define(['viewmodels/learningPaths/commands/updateLearningPathTitleCommand'], function (command) {
    "use strict";
    var
        httpWrapper = require('http/apiHttpWrapper'),
        dataContext= require('dataContext')
    ;

    describe('command [updateLearningPathTitleCommand]', function () {

        describe('execute:', function () {

            var dfd = Q.defer(),
                learningPath = {
                    id: 'id',
                    title: 'title'
                };
            beforeEach(function () {
                spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute()).toBePromise();
            });

            it('should send request to the server to update title', function (done) {
                dfd.resolve();
                dataContext.learningPaths = [learningPath];
                var title = 'title';
                command.execute(learningPath.id, title).fin(function () {
                    expect(httpWrapper.post).toHaveBeenCalledWith('/api/learningpath/title/update', { learningPathId: learningPath.id, title: title });
                    done();
                });
            });

            describe('when title updated successfully', function () {
                describe('when learning path is not found in data context', function () {
                    beforeEach(function () {
                        dataContext.learningPaths = [learningPath];
                        dfd.resolve();
                    });

                    it('should update learning path in data context', function (done) {
                        var id = 'id', title = 'title new';
                         command.execute(id, title).fin(function () {
                            expect(learningPath.title).toBe(title);
                            done();
                        });
                        
                    });
                });
            });

        });
    });


});