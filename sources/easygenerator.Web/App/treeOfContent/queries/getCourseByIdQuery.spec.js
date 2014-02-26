define(['treeOfContent/queries/getCourseByIdQuery'], function (getCourseByIdQuery) {

    describe('query [getCourseByIdQuery]', function () {

        var
            dataContext = require('dataContext')
        ;

        describe('execute:', function () {

            it('should be function', function () {
                expect(getCourseByIdQuery.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(getCourseByIdQuery.execute()).toBePromise();
            });

            describe('when id is not a string', function () {

                it('should reject promise with \'Course id (string) was expected\'', function () {
                    var promise = getCourseByIdQuery.execute();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Course id (string) was expected');
                    });
                });


            });

            describe('when course does not exist', function () {

                it('should reject promise with \'Course with this id is not found\'', function () {
                    dataContext.courses = [];
                    var promise = getCourseByIdQuery.execute('');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Course with this id is not found');
                    });
                });

            });


            it('should resolve promise with course from dataContext', function () {
                var course = { id: 'id' };
                dataContext.courses = [course];

                var promise = getCourseByIdQuery.execute('id');

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(promise).toBeResolvedWith(course);
                });
            });

        });

    });

})