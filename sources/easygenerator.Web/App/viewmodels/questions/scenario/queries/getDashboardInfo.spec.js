import query from './getDashboardInfo';

import apiHttpWrapper from 'http/apiHttpWrapper';

describe('query [getDashboardInfo]', function () {

    describe('execute:', function () {

        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(dfd.promise);
        });

        it('should be function', function () {
            expect(query.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(query.execute()).toBePromise();
        });

        it('should send request', function (done) {
            dfd.resolve();

            query.execute().then(function () {
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/question/scenario/getdashboardinfo');
                done();
            });
        });

        it('should get dashboard info', function (done) {
            var content = {};
            dfd.resolve(content);

            query.execute().then(function (result) {
                expect(result).toEqual(content);
                done();
            });
        });

    });

});
