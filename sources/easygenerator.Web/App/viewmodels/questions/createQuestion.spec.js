define(function (require) {
    "use strict";

    var viewModel = require('viewModels/questions/createQuestion'),
        eventTracker = require('eventTracker'),
        router = require('durandal/plugins/router'),
        objectiveRepository = require('repositories/objectiveRepository'),
        questionRepository = require('repositories/questionRepository');

    var eventsCategory = 'Create Question';

    describe('viewModel [createQuestion]', function () {

        var objective = {
            id: '0',
            title: 'Test Objective 0',
            questions: []
        };

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigateTo');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('showValidation:', function () {
            it('should be observable', function () {
                expect(viewModel.showValidation).toBeObservable();
            });
        });

        describe('title:', function () {
            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

            it('should have \'isModified\' observable', function () {
                expect(viewModel.title.isModified).toBeObservable();
            });

            it('should have \'isEditing\' observable', function () {
                expect(viewModel.title.isModified).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be observable', function () {
                    expect(viewModel.title.isValid).toBeObservable();
                });

                describe('when title is empty', function () {
                    it('should be false', function () {
                        viewModel.title('');
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });
                });

                describe('when title is longer than 255', function () {
                    it('should be false', function () {
                        var title = '';
                        for (var i = 0; i < 256; i++)
                            title += '*';

                        viewModel.title(title);
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });
                });

                describe('when title is not empty and not longer than 255', function () {
                    it('should be true', function () {
                        viewModel.title('lala');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });
                });
            });
        });

        describe('navigateToObjective:', function () {
            it('should be a function', function () {
                expect(viewModel.navigateToObjective).toBeFunction();
            });

            it('should send event \'Navigate to objective\'', function () {
                viewModel.navigateToObjective();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective', eventsCategory);
            });

            it('should navigate to #/objective/{objectiveId}', function () {
                viewModel.objectiveId = 0;
                viewModel.navigateToObjective();
                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/0');
            });
        });

        describe('saveAndEdit:', function () {

            it('should be a function', function () {
                expect(viewModel.saveAndEdit).toBeFunction();
            });

            describe('when title is not valid', function () {
                it('should set showValidation to \'true\'', function () {
                    viewModel.title('');
                    viewModel.saveAndEdit();
                    expect(viewModel.showValidation()).toBeTruthy();
                });
                it('should return undefined', function () {
                    viewModel.title('');
                    var result = viewModel.saveAndEdit();
                    expect(result).toBeUndefined();
                });
            });

            describe('when title is valid', function () {
                it('should set showValidation to \'false\'', function () {
                    viewModel.title('lala');
                    viewModel.saveAndEdit();
                    expect(viewModel.showValidation()).toBeFalsy();
                });

                it('should send event \'Save and edit question\'', function () {
                    viewModel.title('lala');
                    viewModel.saveAndEdit();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Save and edit question', eventsCategory);
                });

                it('should return promise', function () {
                    viewModel.title('lala');
                    var promise = viewModel.saveAndEdit();
                    expect(promise).toBePromise();
                });

                describe('when question is updated successfully', function () {
                    var deferred;

                    beforeEach(function () {
                        deferred = Q.defer();
                        spyOn(questionRepository, 'create').andReturn(deferred.promise);
                    });

                    it('should navigate to edit question', function () {
                        var question = { id: 0, title: 'lala' };
                        viewModel.objectiveId = objective.id;
                        viewModel.title(question.title);
                        var promise = viewModel.saveAndEdit();
                        deferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                            expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objective.id + '/question/' + question.id);
                        });
                    });
                    it('should resolve promise', function () {
                        var question = { id: 0, title: 'lala' };
                        viewModel.objectiveId = objective.id;
                        viewModel.title(question.title);
                        var promise = viewModel.saveAndEdit();
                        deferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                        });
                    });
                });
            });
        });

        describe('saveAndCreate:', function () {
            it('should be a function', function () {
                expect(viewModel.saveAndCreate).toBeFunction();
            });

            describe('when title is not valid', function () {
                it('should set showValidation to \'true\'', function () {
                    viewModel.title('');
                    viewModel.saveAndCreate();
                    expect(viewModel.showValidation()).toBeTruthy();
                });
                it('should return undefined', function () {
                    viewModel.title('');
                    var result = viewModel.saveAndCreate();
                    expect(result).toBeUndefined();
                });
            });

            describe('when title is valid', function () {
                it('should set showValidation to \'false\'', function () {
                    viewModel.title('lala');
                    viewModel.saveAndCreate();
                    expect(viewModel.showValidation()).toBeFalsy();
                });

                it('should send event \'Save and create question\'', function () {
                    viewModel.title('lala');
                    viewModel.saveAndCreate();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Save and create question', eventsCategory);
                });

                it('should return promise', function () {
                    viewModel.title('lala');
                    var promise = viewModel.saveAndCreate();
                    expect(promise).toBePromise();
                });

                describe('when question is updated successfully', function () {
                    var deferred;

                    beforeEach(function () {
                        deferred = Q.defer();
                        spyOn(questionRepository, 'create').andReturn(deferred.promise);
                    });

                    it('should set title value to empty string', function () {
                        var question = { id: 0, title: 'lala' };
                        viewModel.objectiveId = objective.id;
                        viewModel.title(question.title);
                        var promise = viewModel.saveAndCreate();
                        deferred.resolve(question);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.title()).toBe('');
                        });
                    });

                    it('should set title isEditing to \'true\'', function () {
                        var question = { id: 0, title: 'lala' };
                        viewModel.objectiveId = objective.id;
                        viewModel.title(question.title);
                        viewModel.title.isEditing(false);
                        var promise = viewModel.saveAndCreate();
                        deferred.resolve(question);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.title.isEditing()).toBeTruthy();
                        });
                    });

                    it('should set title isModified to \'false\'', function () {
                        var question = { id: 0, title: 'lala' };
                        viewModel.objectiveId = objective.id;
                        viewModel.title('lalal');
                        viewModel.title.isModified(true);
                        var promise = viewModel.saveAndCreate();
                        deferred.resolve(question);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.title.isModified()).toBeFalsy();
                        });
                    });

                    it('should resolve promise', function () {
                        var question = { id: 0, title: 'lala' };
                        viewModel.objectiveId = objective.id;
                        viewModel.title(question.title);
                        var promise = viewModel.saveAndCreate();
                        deferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                        });
                    });
                });
            });
        });

        describe('activate:', function () {
            var deferred;

            beforeEach(function () {
                deferred = Q.defer();
                spyOn(objectiveRepository, 'getById').andReturn(deferred.promise);
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when routeData is not an object', function () {
                it('should navigate to #/400', function () {
                    viewModel.activate();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
                it('should return undefined', function () {
                    var result = viewModel.activate();
                    expect(result).toBeUndefined();
                });
            });

            describe('when routeData.objectiveId is empty', function () {
                it('should navigate to #/400', function () {
                    viewModel.activate({});
                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
                it('should return undefined', function () {
                    var result = viewModel.activate({});
                    expect(result).toBeUndefined();
                });
            });

            describe('when routeData.objectiveId is null', function () {
                it('should navigate to #/400', function () {
                    viewModel.activate({ objectiveId: null });
                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
                it('should return undefined', function () {
                    var result = viewModel.activate({ objectiveId: null });
                    expect(result).toBeUndefined();
                });
            });

            it('should return promise', function () {
                var promise = viewModel.activate({ objectiveId: 0 });
                expect(promise).toBePromise();
            });

            describe('when objective does not exist', function () {
                it('should navigate to #/404', function () {
                    var promise = viewModel.activate({ objectiveId: 0 });
                    deferred.resolve(null);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });
                });
                it('should resolve promise with undefined', function () {
                    var promise = viewModel.activate({ objectiveId: 0 });
                    deferred.resolve(null);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise.inspect().state).toEqual('fulfilled');
                        expect(promise.inspect().value).toEqual(undefined);
                    });
                });
            });

            describe('when objective exists', function () {
                it('should set objectiveId', function () {
                    viewModel.objectiveId = null;
                    var promise = viewModel.activate({ objectiveId: objective.id });
                    deferred.resolve({ id: objective.id });

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.objectiveId).toBe(objective.id);
                    });
                });

                it('should set title value to empty string', function () {
                    viewModel.title();
                    var promise = viewModel.activate({ objectiveId: objective.id });
                    deferred.resolve({ id: objective.id });

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.title()).toBe('');
                    });
                });

                it('should set title isEditing to \'true\'', function () {
                    viewModel.title.isEditing(false);

                    var promise = viewModel.activate({ objectiveId: objective.id });
                    deferred.resolve({ id: objective.id });

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.title.isEditing()).toBeTruthy();
                    });
                });

                it('should set objectiveTitle', function () {
                    viewModel.objectiveTitle = null;

                    var promise = viewModel.activate({ objectiveId: objective.id });
                    deferred.resolve(objective);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.objectiveTitle).toBe(objective.title);
                    });
                });
            });
        });
    });
});