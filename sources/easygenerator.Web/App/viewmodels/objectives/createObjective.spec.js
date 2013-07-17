define(['viewmodels/objectives/createObjective'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext');

        describe('viewModel [createObjective]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            it('is object', function () {
                expect(viewModel).toEqual(jasmine.any(Object));
            });

            it('has title', function () {
                expect(viewModel.title).toBeDefined();
            });

            it('has image', function () {
                expect(viewModel.image).toBeDefined();
            });

            describe('title', function () {

                it('is valid with valid data', function () {
                    viewModel.title('Some title');
                    expect(viewModel.title.isValid()).toBe(true);
                });

                it('is invalid with empty data', function () {
                    viewModel.title('');
                    expect(viewModel.title.isValid()).toBe(false);
                });

                it('is invalid with string bigger than 255 symbols', function () {
                    viewModel.title(new Array(257).join('A'));
                    expect(viewModel.title.isValid()).toBe(false);
                });

            });

            describe('activate', function () {

                it('should show be initialized with empty data', function () {
                    viewModel.activate();

                    expect(viewModel.title()).toBeNull();
                    expect(viewModel.title.isModified()).toBe(false);
                    expect(viewModel.image.currentOption()).toBe(0);
                });

            });

            describe('cancel', function () {

                beforeEach(function () {
                    spyOn(router, 'navigateTo');
                });

                it('should navigate to /#', function () {
                    viewModel.cancel();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/');
                });

            });

            describe('save', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should set title state to modified when title is invalid', function () {
                    viewModel.title('');
                    viewModel.save();

                    expect(viewModel.title.isModified()).toBe(true);
                });

                it('should add new objective to dataContext', function () {
                    var newObjective = {
                        id: dataContext.objectives.length,
                        title: 'TestTitle',
                        image: 'TestImage',
                        questions: []
                    };

                    viewModel.title(newObjective.title);
                    viewModel.image(newObjective.image);

                    viewModel.save();
                    expect(_.find(dataContext.objectives, function (item) {
                        return newObjective.id == item.id &&
                            newObjective.title == item.title &&
                            newObjective.image == item.image;
                    })).toBeDefined();

                });

                it('should navigate to /#', function () {
                    var newObjective = {
                        id: dataContext.objectives.length,
                        title: 'TestTitle',
                        image: 'TestImage',
                        questions: []
                    };

                    viewModel.title(newObjective.title);
                    viewModel.image(newObjective.image);
                    viewModel.save();

                    expect(router.navigateTo).toHaveBeenCalledWith('#/');
                });

                it('should send event', function () {
                    viewModel.title('Test Title');
                    viewModel.save();
                    expect(eventTracker.publish).toHaveBeenCalled();
                });

            });

        });

    }
);