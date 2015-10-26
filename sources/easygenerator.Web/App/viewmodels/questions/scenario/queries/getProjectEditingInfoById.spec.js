define(['viewmodels/questions/scenario/queries/getProjectEditingInfoById'], function (query) {

    var
        apiHttpWrapper = require('http/apiHttpWrapper');

    describe('query [getProjectEditingInfoById]', function () {

        describe('execute:', function () {

            var
                dfd,
                projectId = 'questionId';

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute(projectId)).toBePromise();
            });

            it('should send request', function (done) {
                dfd.resolve();
                
                query.execute(projectId).then(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/scenario/getprojecteditinginfo', { projectId: projectId });
                    done();
                });
            });

            it('should get project content', function (done) {
                var content = {};
                dfd.resolve(content);

                query.execute(projectId).then(function (result) {
                    expect(result).toEqual(content);
                    done();
                });
            });

        });

    });

});