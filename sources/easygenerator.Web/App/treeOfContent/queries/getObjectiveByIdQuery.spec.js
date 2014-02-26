define(['treeOfContent/queries/getObjectiveByIdQuery'], function (getObjectiveByIdQuery) {

    describe('query [getObjectiveByIdQuery]', function () {

        var
            dataContext = require('dataContext')
        ;

        describe('execute:', function () {

            it('should be function', function () {
                expect(getObjectiveByIdQuery.execute).toBeFunction();
            });

            it('should return promise', function () {
                expect(getObjectiveByIdQuery.execute()).toBePromise();
            });

            describe('when id is not a string', function () {

                it('should reject promise with \'Objective id (string) was expected\'', function () {
                    var promise = getObjectiveByIdQuery.execute();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Objective id (string) was expected');
                    });
                });

            });

            describe('when objective does not exist', function () {

                it('should reject promise with \'Objective with this id is not found\'', function () {
                    dataContext.objectives = [];
                    var promise = getObjectiveByIdQuery.execute('');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Objective with this id is not found');
                    });
                });

            });

            describe('and when objective exists', function () {

                it('should resolve promise with objective from dataContext', function () {
                    var objective = { id: 'id' };
                    dataContext.objectives = [objective];

                    var promise = getObjectiveByIdQuery.execute('id');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(objective);
                    });
                });

            });

        });

    });

})