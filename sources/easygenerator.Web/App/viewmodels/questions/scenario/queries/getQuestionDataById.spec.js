define(['viewmodels/questions/scenario/queries/getQuestionDataById'], function (query) {

    var
        apiHttpWrapper = require('http/apiHttpWrapper');

    describe('query [getQuestionDataById]', function () {

        describe('execute:', function () {

            var
                dfd,
                questionId = 'questionId';

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute(questionId)).toBePromise();
            });

            it('should send request', function (done) {
                dfd.resolve();

                query.execute(questionId).then(function () {
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/scenario', { questionId: questionId });
                    done();
                });
            });

            it('should get question content', function (done) {
                var content = {};
                dfd.resolve(content);

                query.execute(questionId).then(function (result) {
                    expect(result).toEqual(content);
                    done();
                });
            });

        });

    });

});