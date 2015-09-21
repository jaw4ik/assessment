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

            it('should resolve promise with audio collection sorted desc', function (done) {
                dataContext.audios = [{ createdOn: '2013-09-08T08:25:51.777' }, { createdOn: '2014-09-08T08:25:51.777' }, { createdOn: '2015-09-08T08:25:51.777' }];

                query.execute().then(function (result) {
                    expect(result.length).toEqual(3);
                    expect(result[0].createdOn).toEqual('2015-09-08T08:25:51.777');
                    expect(result[1].createdOn).toEqual('2014-09-08T08:25:51.777');
                    expect(result[2].createdOn).toEqual('2013-09-08T08:25:51.777');
                    done();
                }).done();
            });

        });

    });
})