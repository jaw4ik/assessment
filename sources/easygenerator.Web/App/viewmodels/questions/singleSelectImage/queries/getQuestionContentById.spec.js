define(['viewmodels/questions/singleSelectImage/queries/getQuestionContentById'], function (query) {

    var
        httpWrapper = require('http/httpWrapper')
    ;

    describe('query singleSelectImage [getQuestionContentById]', function () {

        describe('execute:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(httpWrapper, 'post').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute()).toBePromise();
            });

            it('should get question content', function (done) {
                var content = {
                    answers: [{ id: 'id' }]
                }
                dfd.resolve(content);

                query.execute().then(function (result) {
                    expect(result).toEqual(content);
                    done();
                });
            });

        });

    });

})