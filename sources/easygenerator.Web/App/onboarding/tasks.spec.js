define(['onboarding/tasks'], function(tasks) {
    "use strict";

    var
        constants = require('constants'),
        apiHttpWrapper = require('http/apiHttpWrapper'),
        app = require('durandal/app');

    function getTaskByName(name) {
        return _.find(tasks, function(task) {
            return task.name === name;
        });
    }

    describe('onboarding [tasks]', function() {

        var httpPostDefer;
        beforeEach(function() {
            httpPostDefer = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(httpPostDefer.promise);

            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        it('should be defined', function() {
            expect(tasks).toBeDefined();
        });

        describe('createCourse:', function() {

            var taskInitializer = getTaskByName('createCourse');

            it('should be function', function() {
                expect(taskInitializer).toBeFunction();
            });

            var task;
            beforeEach(function() {
                task = taskInitializer({});
            });

            it('should be object', function() {
                expect(task).toBeObject();
            });

            describe('isCompleted:', function() {

                it('should be observable', function() {
                    expect(task.isCompleted).toBeObservable();
                });

            });

            describe('title:', function() {

                it('should be defined', function() {
                    expect(task.title).toBeDefined();
                });

            });

            describe('description:', function() {

                it('should be defined', function() {
                    expect(task.description).toBeDefined();
                });

            });

            describe('handler:', function() {

                it('should be function', function() {
                    expect(task.handler).toBeFunction();
                });

                it('should call api \'api/onboarding/coursecreated\'', function() {
                    task.handler();
                    httpPostDefer.resolve();
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding/coursecreated');
                });

                describe('when request is success', function() {

                    beforeEach(function() {
                        httpPostDefer.resolve();
                    });

                    it('should turn off event ' + constants.messages.course.created, function(done) {
                        task.handler();
                        httpPostDefer.promise.fin(function() {
                            expect(app.off).toHaveBeenCalledWith(constants.messages.course.created, task.handler);
                            done();
                        });
                    });

                    it('should set isCompleted to true', function(done) {
                        task.handler();
                        httpPostDefer.promise.fin(function() {
                            expect(task.isCompleted()).toBeTruthy();
                            done();
                        });
                    });

                });

            });

            describe('when task is uncompleted', function() {

                beforeEach(function() {
                    task = taskInitializer({ courseCreated: false });
                });

                it('isCompleted should be false', function() {
                    expect(task.isCompleted()).toBeFalsy();
                });

                it('should subscribe to event ' + constants.messages.course.created, function() {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.course.created, task.handler);
                });

            });

            describe('when task is completed', function() {

                beforeEach(function() {
                    task = taskInitializer({ courseCreated: true });
                });

                it('isCompleted should be true', function() {
                    expect(task.isCompleted()).toBeTruthy();
                });

                it('should not subscribe to event ' + constants.messages.course.created, function() {
                    expect(app.on).not.toHaveBeenCalledWith(constants.messages.course.created, task.handler);
                });

            });

        });

        describe('defineObjective:', function() {

            var taskInitializer = getTaskByName('defineObjective');

            it('should be function', function() {
                expect(taskInitializer).toBeFunction();
            });

            var task;
            beforeEach(function() {
                task = taskInitializer({});
            });

            it('should be object', function() {
                expect(task).toBeObject();
            });

            describe('isCompleted:', function() {

                it('should be observable', function() {
                    expect(task.isCompleted).toBeObservable();
                });

            });

            describe('title:', function() {

                it('should be defined', function() {
                    expect(task.title).toBeDefined();
                });

            });

            describe('description:', function() {

                it('should be defined', function() {
                    expect(task.description).toBeDefined();
                });

            });

            describe('handler:', function() {

                it('should be function', function() {
                    expect(task.handler).toBeFunction();
                });

                it('should call api \'api/onboarding/objectivecreated\'', function() {
                    task.handler();
                    httpPostDefer.resolve();
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding/objectivecreated');
                });

                describe('when request is success', function() {

                    beforeEach(function() {
                        httpPostDefer.resolve();
                    });

                    it('should turn off event ' + constants.messages.objective.createdInCourse, function(done) {
                        task.handler();
                        httpPostDefer.promise.fin(function() {
                            expect(app.off).toHaveBeenCalledWith(constants.messages.objective.createdInCourse, task.handler);
                            done();
                        });
                    });

                    it('should set isCompleted to true', function(done) {
                        task.handler();
                        httpPostDefer.promise.fin(function() {
                            expect(task.isCompleted()).toBeTruthy();
                            done();
                        });
                    });

                });

            });

            describe('when task is uncompleted', function() {

                beforeEach(function() {
                    task = taskInitializer({ objectiveCreated: false });
                });

                it('isCompleted should be false', function() {
                    expect(task.isCompleted()).toBeFalsy();
                });

                it('should subscribe to event ' + constants.messages.objective.createdInCourse, function() {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.objective.createdInCourse, task.handler);
                });

            });

            describe('when task is completed', function() {

                beforeEach(function() {
                    task = taskInitializer({ objectiveCreated: true });
                });

                it('isCompleted should be true', function() {
                    expect(task.isCompleted()).toBeTruthy();
                });

                it('should not subscribe to event ' + constants.messages.objective.createdInCourse, function() {
                    expect(app.on).not.toHaveBeenCalledWith(constants.messages.objective.createdInCourse, task.handler);
                });

            });

        });

        describe('addContent:', function() {

            var taskInitializer = getTaskByName('addContent');

            it('should be function', function() {
                expect(taskInitializer).toBeFunction();
            });

            var task;
            beforeEach(function() {
                task = taskInitializer({});
            });

            it('should be object', function() {
                expect(task).toBeObject();
            });

            describe('isCompleted:', function() {

                it('should be observable', function() {
                    expect(task.isCompleted).toBeObservable();
                });

            });

            describe('title:', function() {

                it('should be defined', function() {
                    expect(task.title).toBeDefined();
                });

            });

            describe('description:', function() {

                it('should be defined', function() {
                    expect(task.description).toBeDefined();
                });

            });

            describe('handler:', function() {

                it('should be function', function() {
                    expect(task.handler).toBeFunction();
                });

                describe('when question created', function() {

                    var question = {
                        type: constants.questionType.multipleSelect.type
                    };

                    it('should not call api \'api/onboarding/contentcreated\'', function() {
                        task.handler(null, question);
                        httpPostDefer.resolve();
                        expect(apiHttpWrapper.post).not.toHaveBeenCalled();
                    });

                });

                describe('when information content created', function() {

                    var question = {
                        type: constants.questionType.informationContent.type
                    };

                    it('should call api \'api/onboarding/contentcreated\'', function() {
                        task.handler(null, question);
                        httpPostDefer.resolve();
                        expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding/contentcreated');
                    });

                    describe('when request is success', function() {

                        beforeEach(function() {
                            httpPostDefer.resolve();
                        });

                        it('should turn off event ' + constants.messages.question.created, function(done) {
                            task.handler(null, question);
                            httpPostDefer.promise.fin(function() {
                                expect(app.off).toHaveBeenCalledWith(constants.messages.question.created, task.handler);
                                done();
                            });
                        });

                        it('should set isCompleted to true', function(done) {
                            task.handler(null, question);
                            httpPostDefer.promise.fin(function() {
                                expect(task.isCompleted()).toBeTruthy();
                                done();
                            });
                        });

                    });

                });

            });

            describe('when task is uncompleted', function() {

                beforeEach(function() {
                    task = taskInitializer({ contentCreated: false });
                });

                it('isCompleted should be false', function() {
                    expect(task.isCompleted()).toBeFalsy();
                });

                it('should subscribe to event ' + constants.messages.question.created, function() {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.question.created, task.handler);
                });

            });

            describe('when task is completed', function() {

                beforeEach(function() {
                    task = taskInitializer({ contentCreated: true });
                });

                it('isCompleted should be true', function() {
                    expect(task.isCompleted()).toBeTruthy();
                });

                it('should not subscribe to event ' + constants.messages.question.created, function() {
                    expect(app.on).not.toHaveBeenCalledWith(constants.messages.question.created, task.handler);
                });

            });

        });

        describe('createQuestions:', function() {

            var taskInitializer = getTaskByName('createQuestions');

            it('should be function', function() {
                expect(taskInitializer).toBeFunction();
            });

            var task;
            beforeEach(function() {
                task = taskInitializer({});
            });

            it('should be object', function() {
                expect(task).toBeObject();
            });

            describe('createdQuestionsCount:', function() {

                it('should be observable', function() {
                    expect(task.createdQuestionsCount).toBeObservable();
                });

            });

            describe('isCompleted:', function() {

                it('should be computed', function() {
                    expect(task.isCompleted).toBeComputed();
                });

                describe('when createdQuestionsCount < 3', function() {

                    beforeEach(function() {
                        task.createdQuestionsCount(1);
                    });

                    it('should be false', function() {
                        expect(task.isCompleted()).toBeFalsy();
                    });

                });

                describe('when createdQuestionsCount >= 3', function() {

                    beforeEach(function() {
                        task.createdQuestionsCount(3);
                    });

                    it('should be true', function() {
                        expect(task.isCompleted()).toBeTruthy();
                    });

                });

            });

            describe('title:', function() {

                it('should be observable', function() {
                    expect(task.title).toBeObservable();
                });

                describe('when createdQuestionsCount changed', function() {

                    it('should change title', function() {
                        task.createdQuestionsCount(0);
                        var oldTitle = task.title();
                        task.createdQuestionsCount(task.createdQuestionsCount() + 1);
                        expect(task.title()).not.toBe(oldTitle);
                    });

                });

            });

            describe('description:', function() {

                it('should be defined', function() {
                    expect(task.description).toBeDefined();
                });

            });

            describe('handler:', function() {

                it('should be function', function() {
                    expect(task.handler).toBeFunction();
                });

                describe('when information content created', function() {

                    var question = {
                        type: constants.questionType.informationContent.type
                    };

                    it('should not call api \'api/onboarding/questioncreated\'', function() {
                        task.handler(null, question);
                        httpPostDefer.resolve();
                        expect(apiHttpWrapper.post).not.toHaveBeenCalled();
                    });

                });

                describe('when question created', function() {

                    var question = {
                        type: constants.questionType.multipleSelect.type
                    };

                    it('should call api \'api/onboarding/questioncreated\'', function() {
                        task.handler(null, question);
                        httpPostDefer.resolve();
                        expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding/questioncreated');
                    });

                    describe('when request is success', function() {

                        beforeEach(function() {
                            httpPostDefer.resolve();
                        });

                        it('should increment createdQuestionsCount', function(done) {
                            task.createdQuestionsCount(0);
                            task.handler(null, question);
                            httpPostDefer.promise.fin(function() {
                                expect(task.createdQuestionsCount()).toBe(1);
                                done();
                            });
                        });

                        describe('and when createdQuestionsCount >= 2', function() {

                            beforeEach(function() {
                                task.createdQuestionsCount(2);
                            });

                            it('should turn off event ' + constants.messages.question.created, function(done) {
                                task.handler(null, question);
                                httpPostDefer.promise.fin(function() {
                                    expect(app.off).toHaveBeenCalledWith(constants.messages.question.created, task.handler);
                                    done();
                                });
                            });

                            it('should set isCompleted to true', function(done) {
                                task.handler(null, question);
                                httpPostDefer.promise.fin(function() {
                                    expect(task.isCompleted()).toBeTruthy();
                                    done();
                                });
                            });

                        });

                    });

                });

            });

            describe('when createdQuestionsCount = 0', function() {

                beforeEach(function() {
                    task = taskInitializer({ createdQuestionsCount: 0 });
                });

                it('should set createdQuestionsCount', function() {
                    expect(task.createdQuestionsCount()).toBe(0);
                });

                it('isCompleted should be false', function() {
                    expect(task.isCompleted()).toBeFalsy();
                });

                it('should subscribe to event ' + constants.messages.question.created, function() {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.question.created, task.handler);
                });

            });

            describe('when createdQuestionsCount = 3', function() {

                beforeEach(function() {
                    task = taskInitializer({ createdQuestionsCount: 3 });
                });

                it('should set createdQuestionsCount', function() {
                    expect(task.createdQuestionsCount()).toBe(3);
                });

                it('isCompleted should be true', function() {
                    expect(task.isCompleted()).toBeTruthy();
                });

                it('should not subscribe to event ' + constants.messages.question.created, function() {
                    expect(app.on).not.toHaveBeenCalledWith(constants.messages.question.created, task.handler);
                });

            });

        });

        describe('publishCourse:', function() {

            var taskInitializer = getTaskByName('publishCourse');

            it('should be function', function() {
                expect(taskInitializer).toBeFunction();
            });

            var task;
            beforeEach(function() {
                task = taskInitializer({});
            });

            it('should be object', function() {
                expect(task).toBeObject();
            });

            describe('isCompleted:', function() {

                it('should be observable', function() {
                    expect(task.isCompleted).toBeObservable();
                });

            });

            describe('title:', function() {

                it('should be defined', function() {
                    expect(task.title).toBeDefined();
                });

            });

            describe('description:', function() {

                it('should be defined', function() {
                    expect(task.description).toBeDefined();
                });

            });

            describe('handler:', function() {

                it('should be function', function() {
                    expect(task.handler).toBeFunction();
                });

                it('should call api \'api/onboarding/coursepublished\'', function() {
                    task.handler();
                    httpPostDefer.resolve();
                    expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding/coursepublished');
                });

                describe('when request is success', function() {

                    beforeEach(function() {
                        httpPostDefer.resolve();
                    });

                    it('should turn off event ' + constants.messages.course.delivering.finished, function(done) {
                        task.handler();
                        httpPostDefer.promise.fin(function() {
                            expect(app.off).toHaveBeenCalledWith(constants.messages.course.delivering.finished, task.handler);
                            done();
                        });
                    });

                    it('should set isCompleted to true', function(done) {
                        task.handler();
                        httpPostDefer.promise.fin(function() {
                            expect(task.isCompleted()).toBeTruthy();
                            done();
                        });
                    });

                });

            });

            describe('when task is uncompleted', function() {

                beforeEach(function() {
                    task = taskInitializer({ coursePublished: false });
                });

                it('isCompleted should be false', function() {
                    expect(task.isCompleted()).toBeFalsy();
                });

                it('should subscribe to event ' + constants.messages.course.delivering.finished, function() {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.finished, task.handler);
                });

            });

            describe('when task is completed', function() {

                beforeEach(function() {
                    task = taskInitializer({ coursePublished: true });
                });

                it('isCompleted should be true', function() {
                    expect(task.isCompleted()).toBeTruthy();
                });

                it('should not subscribe to event ' + constants.messages.course.delivering.finished, function() {
                    expect(app.on).not.toHaveBeenCalledWith(constants.messages.course.delivering.finished, task.handler);
                });

            });

        });

    });

});