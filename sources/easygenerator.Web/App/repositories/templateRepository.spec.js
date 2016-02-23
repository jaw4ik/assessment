import repository from './templateRepository';

import dataContext from 'dataContext';

describe('repository [templateRepository]', function () {

    it('should be object', function () {
        expect(repository).toBeObject();
    });

    describe('getCollection:', function () {

        it('should be function', function () {
            expect(repository.getCollection).toBeFunction();
        });

        it('should be resolved with templates collection', function (done) {
            var templatesList = [{ id: "1", name: "Default" }, { id: "2", name: "Quiz" }];
            dataContext.templates = templatesList;

            var promise = repository.getCollection();

            promise.fin(function () {
                expect(promise).toBeResolvedWith(templatesList);
                done();
            });
        });

    });

    describe('getById:', function () {

        it('should be function', function () {
            expect(repository.getById).toBeFunction();
        });

        it('should return promise', function () {
            var result = repository.getById('0');
            expect(result).toBePromise();
        });

        describe('when arguments not valid', function () {

            describe('and when Id is undefined', function () {

                it('should throw exception', function () {
                    var f = function () { repository.getById(); };
                    expect(f).toThrow();
                });

            });

            describe('and when Id is null', function () {

                it('should throw exception', function () {
                    var f = function () { repository.getById(null); };
                    expect(f).toThrow();

                });
            });

        });

        describe('when arguments are valid', function () {

            it('should return promise', function () {
                var result = repository.getById('0');
                expect(result).toBePromise();
            });

            describe('and when template does not exist', function () {

                it('should be rejected', function (done) {
                    dataContext.templates = [];
                    var promise = repository.getById('-1');

                    promise.fin(function () {
                        expect(promise).toBeRejected();
                        done();
                    });
                });

            });

            describe('and when template exists', function () {

                it('should be resolved with template from dataContext', function (done) {
                    var template = { id: '0', name: 'Quizz' };
                    dataContext.templates = [template];

                    var promise = repository.getById('0');

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(template);
                        done();
                    });
                });

            });

        });

    });

    describe('add:', function () {
        it('should be function', function() {
            expect(repository.add).toBeFunction();
        });

        describe('when template is undefined or null', function () {
            it('should throw exception', function () {
                var f = function () { repository.add(null); };
                expect(f).toThrow();
            });
        });

        it('should add template to the dataContext', function () {
            var template = { id: '0', name: 'Quizz' };
            dataContext.templates = [];
            repository.add(template);

            expect(dataContext.templates.length).toBe(1);
            expect(dataContext.templates[0]).toBe(template);
        });
    });

});
