define(['viewmodels/questions/dragAndDrop/queries/getQuestionContentById'], function (query) {

    var
        httpWrapper = require('http/httpWrapper')
    ;

    describe('query [getQuestionContentById]', function () {

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

            it('should parse question content', function (done) {
                var content = {
                    background: 'background',
                    dropspots: [{ id: 'id' }]
                }
                dfd.resolve({ content: JSON.stringify(content) });

                query.execute().then(function (result) {
                    expect(result).toEqual(content);
                    done();
                });
            });

        });

    });

})