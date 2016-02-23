import getCourseByIdQuery from './getCourseByIdQuery';

import dataContext from 'dataContext';

describe('query [getCourseByIdQuery]', function () {

    describe('execute:', function () {

        it('should be function', function () {
            expect(getCourseByIdQuery.execute).toBeFunction();
        });

        it('should return promise', function () {
            expect(getCourseByIdQuery.execute()).toBePromise();
        });

        describe('when id is not a string', function () {

            it('should reject promise with \'Course id (string) was expected\'', function (done) {
                var promise = getCourseByIdQuery.execute();

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course id (string) was expected');
                    done();
                });
            });


        });

        describe('when course does not exist', function () {

            it('should reject promise with \'Course with this id is not found\'', function (done) {
                dataContext.courses = [];
                var promise = getCourseByIdQuery.execute('');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Course with this id is not found');
                    done();
                });
            });

        });


        it('should resolve promise with course from dataContext', function (done) {
            var course = { id: 'id' };
            dataContext.courses = [course];

            var promise = getCourseByIdQuery.execute('id');

            promise.fin(function () {
                expect(promise).toBeResolvedWith(course);
                done();
            });
        });

    });

});
