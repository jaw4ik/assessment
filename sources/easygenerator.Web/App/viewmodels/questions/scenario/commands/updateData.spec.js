define(['viewmodels/questions/scenario/commands/updateData'], function (command) {
    var
        apiHttpWrapper = require('http/apiHttpWrapper')
    ;

    describe('command [updateData]', function () {

        describe('execute:', function () {

            var
                dfd = Q.defer(),
                questionId = 'questionId',
                projectInfo = {
                    permalink: 'permalink',
                    embed_code: 'embed_code',
                    embed_url: 'embed_url',
                    zip_url: 'zip_url'
                };

            beforeEach(function () {
                spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(command.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(command.execute(questionId, projectInfo)).toBePromise();
            });

            it('should send request to the server to update scenario data', function (done) {
                dfd.resolve();

                command.execute(questionId, projectInfo).then(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/scenario/updatedata', {
                        questionId: questionId,
                        projectId: projectInfo.permalink,
                        embedCode: projectInfo.embed_code,
                        embedUrl: projectInfo.embed_url,
                        projectArchiveUrl: projectInfo.zip_url
                    });
                    done();
                });
            });

        });
    });


});