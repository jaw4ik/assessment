define(['viewmodels/courses/createCourse'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        uiLocker = require('uiLocker'),
        repository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        localizationManager = require('localization/localizationManager'),
        BackButton = require('models/backButton')
    ;

    describe('viewModel [createCourse]', function () {

        beforeEach(function () {
            spyOn(router, 'navigate');
            spyOn(eventTracker, 'publish');
        });

        it('should be a object', function () {
            expect(viewModel).toBeObject();
        });

        describe('courseTitleMaxLength:', function () {

            it('should be defined', function () {
                expect(viewModel.courseTitleMaxLength).toBeDefined();
            });

            it('should be 255', function () {
                expect(viewModel.courseTitleMaxLength).toBe(255);
            });

        });

        describe('templates:', function () {

            it('should be observable array', function () {
                expect(viewModel.templates).toBeObservableArray();
            });

        });

        describe('title:', function () {

            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

            it('should be validatable', function () {
                expect(viewModel.title.isValid).toBeComputed();
            });

            it('should be editable', function () {
                expect(viewModel.title.isEditing).toBeObservable();
            });

            describe('when start editing', function () {

                it('should send event \'Define title\'', function () {
                    viewModel.title.startEditing();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Define title');
                });

            });

            describe('when title is empty', function () {

                it('should be not valid', function () {
                    viewModel.title("");
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

            });

            describe('when title is longer that 255', function () {

                it('should be not valid', function () {
                    viewModel.title(utils.createString(256));
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

            });

            describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                it('should be valid', function () {
                    viewModel.title(' ' + utils.createString(254) + ' ');
                    expect(viewModel.title.isValid()).toBeTruthy();
                });

            });

            describe('when title is whitespace', function () {

                it('should be not valid', function () {
                    viewModel.title("           ");
                    expect(viewModel.title.isValid()).toBeFalsy();
                });

            });

        });

        describe('isFormFilled:', function () {

            it('should be function', function () {
                expect(viewModel.isFormFilled).toBeFunction();
            });

            describe('when title not valid', function () {

                it('should be false', function () {
                    viewModel.title('');
                    expect(viewModel.isFormFilled()).toBeFalsy();
                });

            });

            describe('when template is not selected', function () {

                it('should be false', function () {
                    spyOn(viewModel, 'getSelectedTemplate').and.returnValue(undefined);
                    expect(viewModel.isFormFilled()).toBeFalsy();
                });

            });

            describe('when title is valid and template selected', function () {

                it('should be true', function () {
                    viewModel.title('Some title');
                    viewModel.templates([{ isSelected: ko.observable(true) }]);
                    expect(viewModel.isFormFilled()).toBeTruthy();
                });

            });

        });

        describe('getSelectedTemplate:', function () {

            it('should be function', function () {
                expect(viewModel.getSelectedTemplate).toBeFunction();
            });

            it('should return selected template', function () {
                viewModel.templates([
                    { id: 0, isSelected: ko.observable(false) },
                    { id: 1, isSelected: ko.observable(true) }
                ]);
                expect(viewModel.getSelectedTemplate().id).toBe(1);
            });

        });

        describe('resetTemplatesSelection:', function () {

            it('should be function', function () {
                expect(viewModel.resetTemplatesSelection).toBeFunction();
            });

            it('should set isSelected to false for all templates', function () {
                viewModel.templates()[0].isSelected(true);
                viewModel.templates()[1].isSelected(true);
                viewModel.resetTemplatesSelection();
                expect(viewModel.templates()[0].isSelected()).toBeFalsy();
                expect(viewModel.templates()[1].isSelected()).toBeFalsy();
            });

        });

        describe('selectTemplate:', function () {

            it('should be function', function () {
                expect(viewModel.selectTemplate).toBeFunction();
            });

            it('should send event \'Choose template\'', function () {
                viewModel.selectTemplate();
                expect(eventTracker.publish).toHaveBeenCalledWith('Choose template');
            });

            var templates;
            beforeEach(function () {
                templates = [{ id: 0, isSelected: ko.observable(false) }, { id: 1, isSelected: ko.observable(false) }];
            });

            it('should set isSelected to true', function () {
                viewModel.selectTemplate(templates[0]);
                expect(templates[0].isSelected()).toBeTruthy();
            });

            it('should unselect all enother templates', function () {
                templates[0].isSelected(true);
                viewModel.templates(templates);
                viewModel.selectTemplate(templates[1]);
                expect(viewModel.templates()[0].isSelected()).toBeFalsy();
            });

        });

        describe('createAndContinue:', function () {

            var addCourse;
            var template = { id: 'id', name: 'lala', image: 'img', isSelected: ko.observable(false) };
            beforeEach(function () {
                addCourse = Q.defer();
                spyOn(repository, 'addCourse').and.returnValue(addCourse.promise);
                viewModel.templates([template]);
            });

            it('should be function', function () {
                expect(viewModel.createAndContinue).toBeFunction();
            });

            it('should send event \'Create course and open its properties\'', function () {
                viewModel.title.isValid = function () { };
                viewModel.createAndContinue();
                expect(eventTracker.publish).toHaveBeenCalledWith('Create course and open its properties');
            });

            describe('and title is not valid', function () {

                it('should not add course to repository', function () {
                    viewModel.title.isValid = function () {
                        return false;
                    };

                    viewModel.createAndContinue();
                    expect(repository.addCourse).not.toHaveBeenCalled();
                });

            });

            describe('and template is not set', function () {

                it('should not add course to repository', function () {
                    spyOn(viewModel, 'getSelectedTemplate').and.returnValue(undefined);

                    viewModel.createAndContinue();
                    expect(repository.addCourse).not.toHaveBeenCalled();
                });

            });

            describe('and title is valid and template is selected', function () {

                beforeEach(function () {
                    viewModel.templates()[0].isSelected(true);
                    viewModel.title.isValid = function () { return true; };
                });

                it('should trim course title', function () {
                    viewModel.title('           title           ');
                    viewModel.createAndContinue();
                    expect(repository.addCourse).toHaveBeenCalledWith('title', template.id);
                });

                it('should add course to repository', function () {
                    viewModel.title('title');
                    viewModel.createAndContinue();
                    expect(repository.addCourse).toHaveBeenCalledWith('title', template.id);
                });

                it('should lock content', function () {
                    spyOn(uiLocker, 'lock');
                    viewModel.createAndContinue();
                    expect(uiLocker.lock).toHaveBeenCalled();
                });

                describe('and course was added successfully', function () {

                    it('should unlock content', function (done) {
                        spyOn(uiLocker, "unlock");
                        viewModel.createAndContinue();

                        addCourse.resolve();

                        addCourse.promise.fin(function () {
                            expect(uiLocker.unlock).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should navigate to the added course', function (done) {
                        var id = 'id';

                        viewModel.createAndContinue();

                        addCourse.resolve({ id: id });

                        addCourse.promise.fin(function () {
                            expect(router.navigate).toHaveBeenCalledWith('course/' + id);
                            done();
                        });
                    });

                });

                describe('and course does not add', function () {

                    it('should unlock content', function (done) {
                        spyOn(uiLocker, "unlock");
                        viewModel.createAndContinue();

                        addCourse.reject();

                        addCourse.promise.fin(function () {
                            expect(uiLocker.unlock).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

        });

        describe('navigateToCoursesEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToCoursesEvent).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToCoursesEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                var result = viewModel.activate();
                expect(result).toBePromise();
            });

            it('should clear title field', function () {
                viewModel.title('Some title');
                viewModel.activate();
                expect(viewModel.title()).toBe('');
            });

            var getTemplatesDeferred, getTemplatesPromise;

            beforeEach(function () {
                getTemplatesDeferred = Q.defer();

                spyOn(templateRepository, 'getCollection').and.returnValue(getTemplatesDeferred.promise);
                getTemplatesPromise = getTemplatesDeferred.promise.fin(function () { });
            });

            it('should get templates from repository', function (done) {
                getTemplatesDeferred.resolve([]);
                viewModel.activate().fin(function () {
                    expect(templateRepository.getCollection).toHaveBeenCalled();
                    done();
                });
            });

            describe('when get templates from repository', function () {

                describe('and when received templates successfully', function () {
                    beforeEach(function () {
                        viewModel.templates([]);
                        getTemplatesDeferred.resolve([
                            { id: "0", name: "Default", description: "Default template", image: "path/to/image1.png", previewDemoUrl: 'preview_url_default' },
                            { id: "1", name: "Quiz", description: "Quiz template", image: "path/to/image2.png", previewDemoUrl: 'preview_url_quiz' }
                        ]);
                    });

                    it('should initialize templates collection', function (done) {
                        viewModel.activate().fin(function () {
                            expect(viewModel.templates().length).toBe(2);
                            done();
                        });
                    });

                    describe('should map templates:', function () {

                        var template;
                        beforeEach(function (done) {
                            viewModel.activate().fin(function () {
                                template = viewModel.templates()[0];
                                done();
                            });
                        });

                        describe('id:', function () {

                            it('should be defined', function () {
                                expect(template.id).toBeDefined();
                            });

                        });

                        describe('name:', function () {

                            it('should be defined', function () {
                                expect(template.name).toBeDefined();
                            });

                        });

                        describe('description:', function () {

                            it('should be defined', function () {
                                expect(template.description).toBeDefined();
                            });

                        });

                        describe('image:', function () {

                            it('should be defined', function () {
                                expect(template.image).toBeDefined();
                            });

                        });

                        describe('isSelected:', function () {

                            it('should be observable', function () {
                                expect(template.isSelected).toBeObservable();
                            });

                            it('should be false by default', function () {
                                expect(template.isSelected()).toBeFalsy();
                            });

                        });

                        describe('openPreview:', function () {

                            it('should be function', function () {
                                expect(template.openPreview).toBeFunction();
                            });

                            var event = {
                                stopPropagation: function () { }
                            };

                            beforeEach(function () {
                                spyOn(event, 'stopPropagation');
                                spyOn(router, 'openUrl').and.callFake(function () { });
                            });

                            it('should stop propagation', function () {
                                template.openPreview(template, event);
                                expect(event.stopPropagation).toHaveBeenCalled();
                            });

                            it('should open template preview in new tab', function () {
                                template.openPreview(template, event);
                                expect(router.openUrl).toHaveBeenCalledWith(template.previewUrl);
                            });

                        });

                    });

                    it('should initialize templates collection sorted by name asc', function (done) {
                        viewModel.activate().fin(function () {
                            expect(viewModel.templates()).toBeSortedAsc('name');
                            done();
                        });
                    });

                });
            });
        });

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

            it('should be configured', function () {
                expect(viewModel.backButtonData.url).toBe('courses');
                expect(viewModel.backButtonData.backViewName).toBe(localizationManager.localize('courses'));
                expect(viewModel.backButtonData.callback).toBe(viewModel.navigateToCoursesEvent);
            });

        });

    });
}
);