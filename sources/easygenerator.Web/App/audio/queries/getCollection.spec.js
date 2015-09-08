define(['audio/queries/getCollection'], function (query) {

    describe('[audio getCollection query]', function () {

        var dataContext = require('dataContext');

        describe('execute:', function () {

            it('should be function', function () {
                expect(query.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(query.execute()).toBePromise();
            });

            it('should resolve promise with audio collection', function (done) {
                dataContext.audios = [{}, {}];

                query.execute().then(function (result) {
                    expect(result.length).toEqual(2);
                    done();
                }).done();
            });

        });

    });
})