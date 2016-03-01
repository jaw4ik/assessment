import getSectionByIdQuery from './getSectionByIdQuery';

import dataContext from 'dataContext';

describe('query [getSectionByIdQuery]', function () {

    describe('execute:', function () {

        it('should be function', function () {
            expect(getSectionByIdQuery.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(getSectionByIdQuery.execute()).toBePromise();
        });

        describe('when id is not a string', function () {

            it('should reject promise with \'Section id (string) was expected\'', function (done) {
                var promise = getSectionByIdQuery.execute();

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section id (string) was expected');
                    done();
                });
            });

        });

        describe('when section does not exist', function () {

            it('should reject promise with \'Section with this id is not found\'', function (done) {
                dataContext.sections = [];
                var promise = getSectionByIdQuery.execute('');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Section with this id is not found');
                    done();
                });
            });

        });

        describe('and when section exists', function () {

            it('should resolve promise with section from dataContext', function (done) {
                var section = { id: 'id' };
                dataContext.sections = [section];

                var promise = getSectionByIdQuery.execute('id');

                promise.fin(function () {
                    expect(promise).toBeResolvedWith(section);
                    done();
                });
            });

        });

    });

});
