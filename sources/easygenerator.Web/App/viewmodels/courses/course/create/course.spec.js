import viewModel from './course';

import router from 'routing/router';
import eventTracker from 'eventTracker';
import repository from 'repositories/courseRepository';
import sectionRepository from 'repositories/sectionRepository';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import clientContext from 'clientContext';
import userContext from 'userContext';
import imageUpload from 'imageUpload';
import createSectionCommand from 'commands/createSectionCommand';
import constants from 'constants';

describe('viewModel [course]', function () {
    var
        course = {
            id: '1',
            title: 'course',
            sections: [
                { id: '0', title: 'A' },
                { id: '1', title: 'a' },
                { id: '2', title: 'z' },
                { id: '3', title: 'b' }
            ],
            packageUrl: '',
            createdOn: 'createdOn',
            createdBy: 'createdBy',
            modifiedOn: 'modifiedOn',
            builtOn: 'builtOn',
            template: {},
            introductionContent: 'intro'
        },
        identity = { email: 'email' }
    ;

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(router, 'replace');
        spyOn(notify, 'info');
        spyOn(notify, 'error');
        spyOn(notify, 'saved');
        userContext.identity = identity;
    });

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('id:', function () {
        it('should be defined', function () {
            expect(viewModel.id).toBeDefined();
        });
    });

    describe('createdBy:', function () {
        it('should be defined', function () {
            expect(viewModel.createdBy).toBeDefined();
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

    describe('localizationManager:', function () {

        it('should be defined', function () {
            expect(viewModel.localizationManager).toBeDefined();
        });

    });

    describe('updateSectionImage:', function () {

        it('should be function', function () {
            expect(viewModel.updateSectionImage).toBeFunction();
        });

        it('should send event \'Open "change objective image" dialog\'', function () {
            spyOn(imageUpload, 'upload');
            viewModel.updateSectionImage();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open "change objective image" dialog');
        });

        it('should upload image', function () {
            spyOn(imageUpload, 'upload');
            viewModel.updateSectionImage();
            expect(imageUpload.upload).toHaveBeenCalled();
        });

        var section = {
            id: 'some_section_id',
            imageUrl: ko.observable(''),
            isImageLoading: ko.observable(false),
            modifiedOn: ko.observable(new Date())
        };

        describe('when image loading started', function () {

            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.startLoading();
                });
            });

            it('should set isImageLoading to true', function () {
                section.isImageLoading(false);
                viewModel.updateSectionImage(section);
                expect(section.isImageLoading()).toBeTruthy();
            });

        });

        describe('when image was uploaded', function () {

            var url = 'http://url.com', updateImageDefer;
            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.success(url);
                });

                updateImageDefer = Q.defer();
                spyOn(sectionRepository, 'updateImage').and.returnValue(updateImageDefer.promise);
            });

            it('should update section image', function () {
                viewModel.updateSectionImage(section);
                expect(sectionRepository.updateImage).toHaveBeenCalledWith(section.id, url);
            });

            describe('and when section image updated successfully', function () {

                var lastModifiedDate = new Date(), newUrl = 'new/image/url';
                beforeEach(function () {
                    updateImageDefer.resolve({
                        modifiedOn: lastModifiedDate,
                        imageUrl: newUrl
                    });
                });

                it('should set imageUrl', function (done) {
                    section.imageUrl('');
                    viewModel.updateSectionImage(section);

                    updateImageDefer.promise.fin(function () {
                        expect(section.imageUrl()).toBe(newUrl);
                        done();
                    });
                });

                it('should set isImageLoading to false', function (done) {
                    section.isImageLoading(true);
                    viewModel.updateSectionImage(section);

                    updateImageDefer.promise.fin(function () {
                        expect(section.isImageLoading()).toBeFalsy();
                        done();
                    });
                });

                it('should send event \'Change objective image\'', function (done) {
                    viewModel.updateSectionImage(section);

                    updateImageDefer.promise.fin(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Change objective image');
                        done();
                    });
                });

                it('should update notificaion', function (done) {
                    viewModel.updateSectionImage(section);

                    updateImageDefer.promise.fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

        describe('when image loading failed', function () {

            beforeEach(function () {
                spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                    spec.error();
                });
            });

            it('should set isImageLoading to false', function () {
                section.isImageLoading(true);
                viewModel.updateSectionImage(section);
                expect(section.isImageLoading()).toBeFalsy();
            });

        });

    });

    describe('navigateToSectionDetails:', function () {

        it('should be a function', function () {
            expect(viewModel.navigateToSectionDetails).toBeFunction();
        });


        describe('when section is undefined', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.navigateToSectionDetails();
                };
                expect(f).toThrow();
            });

        });

        describe('when section is null', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.navigateToSectionDetails(null);
                };
                expect(f).toThrow();
            });

        });

        describe('when section.id is undefined', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.navigateToSectionDetails({});
                };
                expect(f).toThrow();
            });

        });

        describe('when section.id is null', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.navigateToSectionDetails({ id: null });
                };
                expect(f).toThrow();
            });

        });

        it('should send event \'Navigate to objective details\'', function () {
            viewModel.navigateToSectionDetails({ id: 1 });
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
        });

        it('should navigate', function () {
            var sectionId = 1;
            viewModel.navigateToSectionDetails({ id: sectionId });
            expect(router.navigate).toHaveBeenCalled();
        });

    });

    describe('createSection', function () {
        var courseId = 'courseId';

        beforeEach(function () {
            viewModel.id = courseId;
            spyOn(createSectionCommand, 'execute');
        });

        it('should be a function', function () {
            expect(viewModel.createSection).toBeFunction();
        });

        it('should execute create section command', function () {
            viewModel.createSection();
            expect(createSectionCommand.execute).toHaveBeenCalledWith(courseId);
        });
    });

    describe('toggleSectionSelection:', function () {

        it('should be a function', function () {
            expect(viewModel.toggleSectionSelection).toBeFunction();
        });

        describe('when section is undefined', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.toggleSectionSelection();
                };
                expect(f).toThrow();
            });

        });

        describe('when section is null', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.toggleSectionSelection(null);
                };
                expect(f).toThrow();
            });

        });

        describe('when section.isSelected is not an observable', function () {

            it('should throw exception', function () {
                var f = function () {
                    viewModel.toggleSectionSelection({});
                };
                expect(f).toThrow();
            });

        });

        describe('when section is selected', function () {

            it('should send event \'Unselect Objective\'', function () {
                viewModel.toggleSectionSelection({ isSelected: ko.observable(true) });
                expect(eventTracker.publish).toHaveBeenCalledWith('Unselect Objective');
            });

            it('should set section.isSelected to false', function () {
                var section = { isSelected: ko.observable(true) };
                viewModel.toggleSectionSelection(section);
                expect(section.isSelected()).toBeFalsy();
            });

        });

        describe('when section is not selected', function () {

            it('should send event \'Select Objective\'', function () {
                viewModel.toggleSectionSelection({ isSelected: ko.observable(false) });
                expect(eventTracker.publish).toHaveBeenCalledWith('Select Objective');
            });

            it('should set section.isSelected to true', function () {
                var section = { isSelected: ko.observable(false) };
                viewModel.toggleSectionSelection(section);
                expect(section.isSelected()).toBeTruthy();
            });

        });

    });

    describe('sectionsMode:', function () {

        it('should be observable', function () {
            expect(viewModel.sectionsMode).toBeObservable();
        });

    });

    describe('showAllAvailableSections:', function () {

        it('should be function', function () {
            expect(viewModel.showAllAvailableSections).toBeFunction();
        });

        describe('when sectionsMode is appending', function () {

            beforeEach(function () {
                viewModel.sectionsMode('appending');
            });

            it('should not send event \'Show all available objectives\'', function () {
                viewModel.showAllAvailableSections();
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Show all available objectives');
            });

            it('should not get sections from repository', function () {
                spyOn(sectionRepository, 'getCollection').and.returnValue(Q.defer().promise);

                viewModel.showAllAvailableSections();
                expect(sectionRepository.getCollection).not.toHaveBeenCalled();
            });

        });

        describe('when sectionsMode is not appending', function () {

            var getSectionsDefer;

            beforeEach(function () {
                getSectionsDefer = Q.defer();

                spyOn(sectionRepository, 'getCollection').and.returnValue(getSectionsDefer.promise);

                viewModel.sectionsMode('display');
            });

            it('should send event \'Show all available objectives\'', function () {
                viewModel.showAllAvailableSections();
                expect(eventTracker.publish).toHaveBeenCalledWith('Show all available objectives');
            });

            it('should get sections from repository', function () {
                viewModel.showAllAvailableSections();
                expect(sectionRepository.getCollection).toHaveBeenCalled();
            });

            describe('when get sections', function () {
                beforeEach(function () {
                    getSectionsDefer.resolve([{ id: '0', title: 'B', createdBy: identity.email }, { id: '1', title: 'A', createdBy: identity.email }]);
                });


                describe('and course does not have related sections', function () {

                    it('should set owned sections as available', function (done) {
                        viewModel.connectedSections([]);

                        viewModel.showAllAvailableSections();

                        getSectionsDefer.promise.fin(function () {
                            expect(viewModel.availableSections().length).toBe(2);
                            done();
                        });
                    });

                });

                describe('and course has related sections', function () {

                    it('should set not related sections as available', function (done) {
                        viewModel.connectedSections([{ id: '0', title: 'B', isSelected: ko.observable(false) }]);

                        viewModel.showAllAvailableSections();

                        getSectionsDefer.promise.fin(function () {
                            expect(viewModel.availableSections().length).toBe(1);
                            expect(viewModel.availableSections()[0].id).toBe('1');
                            done();
                        });
                    });

                });

                it('should set sectionsMode to \'appending\'', function (done) {
                    viewModel.showAllAvailableSections();

                    getSectionsDefer.promise.fin(function () {
                        expect(viewModel.sectionsMode()).toBe('appending');
                        done();
                    });
                });

                it('should sort available sections by title', function (done) {
                    viewModel.showAllAvailableSections();

                    getSectionsDefer.promise.fin(function () {
                        expect(viewModel.availableSections()).toBeSortedAsc('title');
                        done();
                    });
                });

            });

        });
    });

    describe('showConnectedSections:', function () {

        it('should be function', function () {
            expect(viewModel.showConnectedSections).toBeFunction();
        });

        describe('when sectionsMode is display', function () {

            beforeEach(function () {
                viewModel.sectionsMode('display');
            });

            it('should send event \'Show connected objectives\'', function () {
                viewModel.showConnectedSections();
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Show connected objectives');
            });

        });

        describe('when sectionsMode is not display', function () {

            beforeEach(function () {
                viewModel.sectionsMode('appending');
            });

            it('should send event \'Show connected objectives\'', function () {
                viewModel.showConnectedSections();
                expect(eventTracker.publish).toHaveBeenCalledWith('Show connected objectives');
            });

            it('should set isSelected property to false for every item in connectedSections collection', function () {
                viewModel.connectedSections([{ isSelected: ko.observable(false) }, { isSelected: ko.observable(true) }]);
                viewModel.showConnectedSections();
                expect(viewModel.connectedSections()[0].isSelected()).toBeFalsy();
                expect(viewModel.connectedSections()[1].isSelected()).toBeFalsy();
            });

            it('should change sectionsMode to \'display\' ', function () {
                viewModel.showConnectedSections();
                expect(viewModel.sectionsMode()).toBe('display');
            });

        });
    });

    describe('connectedSections:', function () {

        it('should be observable', function () {
            expect(viewModel.connectedSections).toBeObservable();
        });

    });

    describe('availableSections:', function () {

        it('should be observable', function () {
            expect(viewModel.availableSections).toBeObservable();
        });

    });

    describe('isSectionsListReorderedByCollaborator:', function () {

        it('should be observable', function () {
            expect(viewModel.isSectionsListReorderedByCollaborator).toBeObservable();
        });

    });

    describe('canDisconnectSections:', function () {

        it('should be computed', function () {
            expect(viewModel.canDisconnectSections).toBeComputed();
        });

        describe('when all related sections are unselected', function () {

            it('should be false', function () {
                viewModel.connectedSections([
                    { id: '0', isSelected: ko.observable(false) },
                    { id: '1', isSelected: ko.observable(false) },
                    { id: '2', isSelected: ko.observable(false) }
                ]);

                expect(viewModel.canDisconnectSections()).toBeFalsy();
            });

        });

        describe('when one of related sections are selected', function () {

            it('should be true', function () {
                viewModel.connectedSections([
                    { id: '0', isSelected: ko.observable(true) },
                    { id: '1', isSelected: ko.observable(false) },
                    { id: '2', isSelected: ko.observable(false) }
                ]);

                expect(viewModel.canDisconnectSections()).toBeTruthy();
            });

        });

        describe('when several related sections are selected', function () {

            it('should be true', function () {
                viewModel.connectedSections([
                    { id: '0', isSelected: ko.observable(false) },
                    { id: '1', isSelected: ko.observable(true) },
                    { id: '2', isSelected: ko.observable(true) }
                ]);

                expect(viewModel.canDisconnectSections()).toBeTruthy();
            });

        });

    });

    describe('canConnectSections:', function () {

        it('should be computed', function () {
            expect(viewModel.canConnectSections).toBeComputed();
        });

        describe('when no available sections are selected', function () {
            it('should be false', function () {
                viewModel.availableSections([
                    { id: '0', isSelected: ko.observable(false) },
                    { id: '1', isSelected: ko.observable(false) },
                    { id: '2', isSelected: ko.observable(false) }
                ]);

                expect(viewModel.canConnectSections()).toBeFalsy();
            });
        });

        describe('when one available section is selected', function () {
            it('should be true', function () {
                viewModel.availableSections([
                    { id: '0', isSelected: ko.observable(true) },
                    { id: '1', isSelected: ko.observable(false) },
                    { id: '2', isSelected: ko.observable(false) }
                ]);

                expect(viewModel.canConnectSections()).toBeTruthy();
            });
        });

        describe('when several available sections are selected', function () {
            it('should be true', function () {
                viewModel.availableSections([
                    { id: '0', isSelected: ko.observable(false) },
                    { id: '1', isSelected: ko.observable(true) },
                    { id: '2', isSelected: ko.observable(true) }
                ]);

                expect(viewModel.canConnectSections()).toBeTruthy();
            });
        });
    });

    describe('disconnectSelectedSections:', function () {

        beforeEach(function () {
            viewModel.id = 'courseId';
        });

        it('should be a function', function () {
            expect(viewModel.disconnectSelectedSections).toBeFunction();
        });

        describe('when no sections selected', function () {
            beforeEach(function () {
                viewModel.connectedSections([]);
                spyOn(repository, 'unrelateSections');
            });

            it('should not send event \'Unrelate objectives from course\'', function () {
                viewModel.disconnectSelectedSections();
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Unrelate objectives from course');
            });

            it('should not call repository \"unrelateSections\" method', function () {
                viewModel.disconnectSelectedSections();
                expect(repository.unrelateSections).not.toHaveBeenCalled();
            });

        });

        describe('when some of related sections is selected', function () {
            var
                relatedSections,
                unrelateSections
            ;

            beforeEach(function () {
                relatedSections = [
                    { id: '0', isSelected: ko.observable(true) },
                    { id: '1', isSelected: ko.observable(false) },
                    { id: '2', isSelected: ko.observable(true) }
                ];

                viewModel.connectedSections(relatedSections);

                unrelateSections = Q.defer();
                spyOn(repository, 'unrelateSections').and.returnValue(unrelateSections.promise);
            });

            it('should send event \'Unrelate objectives from course\'', function () {
                viewModel.disconnectSelectedSections();
                expect(eventTracker.publish).toHaveBeenCalledWith('Unrelate objectives from course');
            });

            it('should call repository \"unrelateSections\" method', function () {
                var sections = _.filter(viewModel.connectedSections(), function (item) {
                    return item.isSelected();
                });
                viewModel.disconnectSelectedSections();
                expect(repository.unrelateSections).toHaveBeenCalledWith('courseId', sections);
            });

            describe('and unrelate sections succeed', function () {

                beforeEach(function () {
                    unrelateSections.resolve(new Date());
                });

                it('should call \'notify.info\' function', function (done) {
                    viewModel.disconnectSelectedSections();

                    unrelateSections.promise.finally(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

                it('should update related sections', function (done) {
                    viewModel.disconnectSelectedSections();

                    unrelateSections.promise.finally(function () {
                        expect(viewModel.connectedSections().length).toBe(1);
                        expect(viewModel.connectedSections()[0].id).toBe('1');
                        done();
                    });
                });

            });

        });

    });

    describe('activate:', function () {

        var getById;

        beforeEach(function () {
            getById = Q.defer();

            userContext.identity = {
                email: 'test@test.com',
                subscription: {
                    accessType: constants.accessType.free
                }
            }

            spyOn(repository, 'getById').and.returnValue(getById.promise);
            spyOn(localizationManager, 'localize').and.returnValue('text');
        });

        it('should get course from repository', function () {
            var id = 'courseId';
            viewModel.activate(id);
            expect(repository.getById).toHaveBeenCalledWith(id);
        });

        describe('when course does not exist', function () {

            beforeEach(function () {
                getById.reject('reason');
            });

            it('should reject promise', function (done) {
                var promise = viewModel.activate('courseId');

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('reason');
                    done();
                });
            });
        });

        describe('when course exists', function () {

            beforeEach(function () {
                getById.resolve(course);
                spyOn(clientContext, 'set');
            });

            it('should set current course id', function (done) {
                viewModel.id = undefined;

                viewModel.activate(course.id).fin(function () {
                    expect(viewModel.id).toEqual(course.id);
                    done();
                });
            });

            it('should set createdBy', function (done) {
                viewModel.id = undefined;

                viewModel.activate(course.id).fin(function () {
                    expect(viewModel.createdBy).toEqual(course.createdBy);
                    done();
                });
            });

            it('should display related sections', function (done) {
                viewModel.sectionsMode('appending');

                viewModel.activate(course.id).fin(function () {
                    expect(viewModel.sectionsMode()).toBe('display');
                    done();
                });
            });

            it('should set current course sections', function (done) {
                viewModel.connectedSections([]);

                viewModel.activate(course.id).fin(function () {
                    expect(viewModel.connectedSections().length).toEqual(4);
                    done();
                });
            });

            it('should resolve promise', function (done) {
                var promise = viewModel.activate(course.id);

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });
            });

        });

    });

    describe('courseIntroductionContent:', function () {

        it('should be object', function () {
            expect(viewModel.courseIntroductionContent).toBeObject();
        });

    });

    describe('reorderSections:', function () {

        var
            relatedSections,
            updateSectionOrderDefer
        ;

        beforeEach(function () {
            relatedSections = [
                { id: '0', isSelected: ko.observable(true) },
                { id: '1', isSelected: ko.observable(false) },
                { id: '2', isSelected: ko.observable(true) }
            ];

            viewModel.connectedSections(relatedSections);
            updateSectionOrderDefer = Q.defer();
            spyOn(repository, 'updateSectionOrder').and.returnValue(updateSectionOrderDefer.promise);
        });

        it('should be function', function () {
            expect(viewModel.reorderSections).toBeFunction();
        });

        it('should send event \'Change order of learning objectives\'', function () {
            viewModel.reorderSections();
            expect(eventTracker.publish).toHaveBeenCalledWith('Change order of learning objectives');
        });

        it('should set isReorderingSections to false', function () {
            viewModel.isReorderingSections(true);
            viewModel.reorderSections();
            expect(viewModel.isReorderingSections()).toBeFalsy();
        });

        it('should call repository \"updateSectionOrder\" method', function () {
            viewModel.reorderSections();
            expect(repository.updateSectionOrder).toHaveBeenCalledWith(viewModel.id, relatedSections);
        });

        describe('when SectionsSortedList is updated', function () {

            it('should show notify saved message', function (done) {
                viewModel.reorderSections();
                updateSectionOrderDefer.resolve();

                updateSectionOrderDefer.promise.finally(function () {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

        });

    });

    describe('isSortingEnabled:', function () {

        it('should be observable', function () {
            expect(viewModel.isSortingEnabled).toBeObservable();
        });

        describe('when connectedSections length not equal 1', function () {

            it('should return true', function () {
                var sectionsList = [
                    { isSelected: ko.observable(false) },
                    { isSelected: ko.observable(false) }
                ];
                viewModel.connectedSections(sectionsList);
                expect(viewModel.isSortingEnabled()).toBeTruthy();
            });

        });

        describe('when connectedSections length equal 1', function () {

            it('should return false', function () {
                var sectionsList = [
                    { isSelected: ko.observable(false) }
                ];
                viewModel.connectedSections(sectionsList);
                expect(viewModel.isSortingEnabled()).toBeFalsy();
            });

        });

    });

    describe('isReorderingSections:', function () {
        it('should be observable', function () {
            expect(viewModel.isReorderingSections).toBeObservable();
        });
    });

    describe('disconnectSection:', function () {

        beforeEach(function () {
            viewModel.id = 'courseId';
        });

        it('should be function', function () {
            expect(viewModel.disconnectSection).toBeFunction();
        });

        describe('when section is not related to course', function () {

            var section;

            beforeEach(function () {
                section = {
                    title: 'abc'
                };
                viewModel.availableSections.push(section);
                spyOn(repository, 'unrelateSections');
            });

            it('should not send event \'Unrelate objectives from course\'', function () {
                viewModel.disconnectSection({ item: section });
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Unrelate objectives from course');
            });

            it('should not call updateSectionOrder repository function with selected sections', function () {
                viewModel.disconnectSection({ item: section });
                expect(repository.unrelateSections).not.toHaveBeenCalled();
            });

        });

        describe('when section is related to course', function () {

            var unrelateSections,
                section;

            beforeEach(function () {
                section = {
                    id: '0', isSelected: ko.observable(false)
                };

                viewModel.connectedSections.push(section);
                unrelateSections = Q.defer();

                spyOn(repository, 'unrelateSections').and.returnValue(unrelateSections.promise);
            });

            it('should send event \'Unrelate objectives from course\'', function () {
                viewModel.disconnectSection({ item: section });
                expect(eventTracker.publish).toHaveBeenCalledWith('Unrelate objectives from course');
            });

            it('should call repository \"unrelateSections\" method', function () {
                viewModel.disconnectSection({ item: section });
                expect(repository.unrelateSections).toHaveBeenCalledWith('courseId', [section]);
            });

            describe('and unrelate section succeed', function () {

                beforeEach(function () {
                    unrelateSections.resolve(new Date());
                });

                it('should call \'notify.info\' function', function (done) {
                    viewModel.disconnectSection({ item: section });

                    unrelateSections.promise.finally(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

    });

    describe('sectionDisconnected:', function () {

        var sectionId = 'id',
            section = { id: sectionId, isSelected: ko.observable(false) };

        it('should be function', function () {
            expect(viewModel.sectionDisconnected).toBeFunction();
        });

        describe('when section is created by current user', function () {
            beforeEach(function () {
                section.createdBy = identity.email;
                viewModel.availableSections([section]);
            });

            it('should not delete section from available sections list', function () {
                viewModel.sectionDisconnected({ item: section });
                expect(viewModel.availableSections().length).toBe(1);
            });
        });

        describe('when section is created by current user', function () {
            beforeEach(function () {
                section.createdBy = 'anonymous@user.com';
                viewModel.availableSections([section]);
            });

            it('should delete section from available sections list', function () {
                viewModel.sectionDisconnected({ item: section });
                expect(viewModel.availableSections().length).toBe(0);
            });
        });
    });

    describe('connectSection:', function () {

        var relateSectionDefer;

        beforeEach(function () {
            relateSectionDefer = Q.defer();

            spyOn(repository, 'relateSection').and.returnValue(relateSectionDefer.promise);
        });

        var section = {
            id: "id1",
            title: ko.observable('section1'),
            modifiedOn: ko.observable('date'),
            isSelected: ko.observable(false)
        };

        it('should be function', function () {
            expect(viewModel.connectSection).toBeFunction();
        });

        it('should send event \'Connect selected objectives to course\'', function () {
            viewModel.connectSection({ item: section });
            expect(eventTracker.publish).toHaveBeenCalledWith('Connect selected objectives to course');
        });

        describe('when section already exists in connected sections', function () {

            var orderSectionDefer, section1, section2;

            beforeEach(function () {
                section1 = {
                    id: '0',
                    isSelected: function () { }
                };
                section2 = {
                    id: '1',
                    isSelected: function () { }
                };
                viewModel.connectedSections([]);
                viewModel.connectedSections.push(section1);
                viewModel.connectedSections.push(section2);
                orderSectionDefer = Q.defer();
                spyOn(repository, 'updateSectionOrder').and.returnValue(orderSectionDefer.promise);
            });

            it('should send event \'Change order of learning objectives\'', function () {
                viewModel.connectSection({ item: section1, targetIndex: 1, sourceIndex: 0 });
                expect(eventTracker.publish).toHaveBeenCalledWith('Change order of learning objectives');
            });

            it('should call updateSectionOrder repository function with selected sections', function () {
                viewModel.connectSection({ item: section1, targetIndex: 1, sourceIndex: 0 });
                expect(repository.updateSectionOrder).toHaveBeenCalledWith(viewModel.id, [{ id: '1' }, { id: '0' }]);
            });

            it('should not send event \'Connect selected objectives to course\'', function () {
                viewModel.connectSection({ item: section1, targetIndex: 1, sourceIndex: 0 });
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Connect selected objectives to course');
            });

            it('should not call updateSectionOrder repository function with selected sections', function () {
                viewModel.connectSection({ item: section1, targetIndex: 1, sourceIndex: 0 });
                expect(repository.relateSection).not.toHaveBeenCalled();
            });

        });

        describe('when section not exists in connected sections', function () {

            beforeEach(function () {
                viewModel.connectedSections([]);
            });

            it('should call relateSections repository function with selected sections', function () {
                viewModel.connectSection({ item: section, targetIndex: 5 });

                expect(repository.relateSection).toHaveBeenCalled();

                expect(repository.relateSection.calls.mostRecent().args[0]).toEqual(viewModel.id);
                expect(repository.relateSection.calls.mostRecent().args[1]).toEqual(section.id);
                expect(repository.relateSection.calls.mostRecent().args[2]).toEqual(5);
            });

            describe('and sections were connected successfully', function () {

                it('should call \'notify.info\' function', function (done) {
                    relateSectionDefer.resolve({ modifiedOn: new Date() });
                    viewModel.connectSection({ item: section, targetIndex: 5 });

                    relateSectionDefer.promise.fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

    });

    describe('introductionContentUpdated:', function () {

        var introductionContent = {
            text: ko.observable(''),
            originalText: ko.observable(''),
            isEditing: ko.observable(false)
        };

        it('should be function', function () {
            expect(viewModel.introductionContentUpdated).toBeFunction();
        });

        describe('when course is current course', function () {

            describe('when introduction content is editing', function () {
                beforeEach(function () {
                    introductionContent.isEditing(true);
                });

                it('should not update course introduction content', function () {
                    viewModel.id = course.id;
                    introductionContent.text('');
                    viewModel.courseIntroductionContent = introductionContent;
                    viewModel.introductionContentUpdated(course);

                    expect(viewModel.courseIntroductionContent.text()).toBe('');
                });

                it('should update original course introduction content', function () {
                    viewModel.id = course.id;
                    introductionContent.originalText('');
                    viewModel.courseIntroductionContent = introductionContent;
                    viewModel.introductionContentUpdated(course);

                    expect(viewModel.courseIntroductionContent.originalText()).toBe(course.introductionContent);
                });
            });

            describe('when introduction content not is editing', function () {
                beforeEach(function () {
                    introductionContent.isEditing(false);
                });

                it('should update course introduction content', function () {
                    viewModel.id = course.id;
                    introductionContent.text('');
                    viewModel.courseIntroductionContent = introductionContent;
                    viewModel.introductionContentUpdated(course);

                    expect(viewModel.courseIntroductionContent.text()).toBe(course.introductionContent);
                });

                it('should update original course introduction content', function () {
                    viewModel.id = course.id;
                    introductionContent.originalText('');
                    viewModel.courseIntroductionContent = introductionContent;
                    viewModel.introductionContentUpdated(course);

                    expect(viewModel.courseIntroductionContent.originalText()).toBe(course.introductionContent);
                });
            });

        });

        describe('when course is not current course', function () {
            it('should not update course introduction content', function () {
                viewModel.id = 'qwe';
                introductionContent.text('');
                viewModel.courseIntroductionContent = introductionContent;
                viewModel.introductionContentUpdated(course);

                expect(viewModel.courseIntroductionContent.text()).toBe('');
            });
        });
    });

    describe('sectionsReordered:', function () {
        var sectionId1 = 'obj1',
            sectionId2 = 'obj2',
            vmSection1 = { id: sectionId1, isSelected: ko.observable(false) },
            vmSection2 = { id: sectionId2, isSelected: ko.observable(false) },
            courseData = {
                id: 'courseId',
                sections: [{ id: sectionId1 }, { id: sectionId2 }]
            };

        it('should be function', function () {
            expect(viewModel.sectionsReordered).toBeFunction();
        });

        describe('when course is current course', function () {

            describe('when sections are reordering', function () {
                beforeEach(function () {
                    viewModel.isReorderingSections(true);
                });

                it('should not reorder sections', function () {
                    viewModel.id = 'qwe';
                    viewModel.connectedSections([vmSection2, vmSection1]);

                    viewModel.sectionsReordered(courseData);

                    expect(viewModel.connectedSections()[0].id).toBe(sectionId2);
                    expect(viewModel.connectedSections()[1].id).toBe(sectionId1);
                });
            });

            describe('when sections are not reordering', function () {
                beforeEach(function () {
                    viewModel.isReorderingSections(false);
                });

                it('should reorder sections', function () {
                    viewModel.id = courseData.id;
                    viewModel.connectedSections([vmSection2, vmSection1]);

                    viewModel.sectionsReordered(courseData);

                    expect(viewModel.connectedSections()[0].id).toBe(sectionId1);
                    expect(viewModel.connectedSections()[1].id).toBe(sectionId2);
                });
            });
        });

        describe('when course is not current course', function () {
            it('should not reorder sections', function () {
                viewModel.id = 'qwe';
                viewModel.connectedSections([vmSection2, vmSection1]);

                viewModel.sectionsReordered(courseData);

                expect(viewModel.connectedSections()[0].id).toBe(sectionId2);
                expect(viewModel.connectedSections()[1].id).toBe(sectionId1);
            });
        });
    });

    describe('startReorderingSections:', function () {

        it('should be function', function () {
            expect(viewModel.startReorderingSections).toBeFunction();
        });

        it('should set isReorderingSections to true', function () {
            viewModel.isReorderingSections(false);
            viewModel.startReorderingSections();
            expect(viewModel.isReorderingSections()).toBeTruthy();
        });

    });

    describe('endReorderingSections:', function () {

        var getById;

        beforeEach(function () {
            getById = Q.defer();
            spyOn(repository, 'getById').and.returnValue(getById.promise);
        });

        it('should be function', function () {
            expect(viewModel.endReorderingSections).toBeFunction();
        });

        describe('when reordering sections has been finished', function () {
            beforeEach(function () {
                viewModel.isReorderingSections(false);
            });

            it('should resolve promise', function (done) {
                var promise = viewModel.endReorderingSections();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });
            });
        });

        describe('when sections have not been reordered by collaborator', function () {
            beforeEach(function () {
                viewModel.isReorderingSections(true);
                viewModel.isSectionsListReorderedByCollaborator(false);
            });

            it('should resolve promise', function (done) {
                var promise = viewModel.endReorderingSections();

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });
            });

            it('should set isReorderingSections to false', function (done) {
                viewModel.isReorderingSections(true);
                var promise = viewModel.endReorderingSections();

                promise.fin(function () {
                    expect(viewModel.isReorderingSections()).toBeFalsy();
                    done();
                });
            });
        });

        describe('when sections have been reordered by collaborator', function () {
            var sectionId1 = 'obj1',
            sectionId2 = 'obj2',
            vmSection1 = { id: sectionId1, isSelected: ko.observable(false) },
            vmSection2 = { id: sectionId2, isSelected: ko.observable(false) },
            course = {
                id: 'courseId',
                sections: [{ id: sectionId1 }, { id: sectionId2 }]
            };

            beforeEach(function () {
                viewModel.isReorderingSections(true);
                viewModel.isSectionsListReorderedByCollaborator(true);
                getById.resolve(course);
            });

            it('should set isReorderingSections to false', function (done) {
                viewModel.isReorderingSections(true);
                var promise = viewModel.endReorderingSections();

                promise.fin(function () {
                    expect(viewModel.isReorderingSections()).toBeFalsy();
                    done();
                });
            });

            it('should set isSectionsListReorderedByCollaborator to false', function (done) {
                viewModel.isReorderingSections(true);
                var promise = viewModel.endReorderingSections();

                promise.fin(function () {
                    expect(viewModel.isSectionsListReorderedByCollaborator()).toBeFalsy();
                    done();
                });
            });

            it('should reorder sections', function (done) {
                viewModel.connectedSections([vmSection2, vmSection1]);

                var promise = viewModel.endReorderingSections();

                promise.fin(function () {
                    expect(viewModel.connectedSections()[0].id).toBe(sectionId1);
                    expect(viewModel.connectedSections()[1].id).toBe(sectionId2);
                    done();
                });
            });
        });

    });

    describe('sectionTitleUpdated:', function () {

        var sectionId = "sectionId";
        var vmSection = {
            id: sectionId,
            title: ko.observable(""),
            isSelected: ko.observable(false),
            modifiedOn: ko.observable("")
        };
        var section = {
            id: sectionId,
            title: "new title",
            modifiedOn: new Date()
        };

        it('should be function', function () {
            expect(viewModel.sectionTitleUpdated).toBeFunction();
        });

        it('should update section title', function () {
            viewModel.connectedSections([vmSection]);
            viewModel.sectionTitleUpdated(section);

            expect(vmSection.title()).toBe(section.title);
        });

        it('should update course modified on date', function () {
            viewModel.connectedSections([vmSection]);
            viewModel.sectionTitleUpdated(section);

            expect(vmSection.modifiedOn().toISOString()).toBe(section.modifiedOn.toISOString());
        });

    });

    describe('sectionImageUpdated:', function () {

        var sectionId = "sectionId";
        var vmSection = {
            id: sectionId,
            title: ko.observable(""),
            imageUrl: ko.observable(""),
            isSelected: ko.observable(false),
            modifiedOn: ko.observable("")
        };
        var section = {
            id: sectionId,
            title: "new title",
            image: 'new/image/url',
            modifiedOn: new Date()
        };

        it('should be function', function () {
            expect(viewModel.sectionImageUpdated).toBeFunction();
        });

        it('should update section imageUrl', function () {
            viewModel.connectedSections([vmSection]);
            viewModel.sectionImageUpdated(section);

            expect(vmSection.imageUrl()).toBe(section.image);
        });

        it('should update course modified on date', function () {
            viewModel.connectedSections([vmSection]);
            viewModel.sectionImageUpdated(section);

            expect(vmSection.modifiedOn().toISOString()).toBe(section.modifiedOn.toISOString());
        });

    });

    describe('sectionUpdated:', function () {

        var sectionId = "sectionId";
        var vmSection = {
            id: sectionId,
            title: ko.observable(""),
            isSelected: ko.observable(false),
            modifiedOn: ko.observable("")
        };
        var section = {
            id: sectionId,
            modifiedOn: new Date()
        };

        it('should be function', function () {
            expect(viewModel.sectionUpdated).toBeFunction();
        });

        it('should update course modified on date', function () {
            viewModel.connectedSections([vmSection]);
            viewModel.sectionUpdated(section);

            expect(vmSection.modifiedOn().toISOString()).toBe(section.modifiedOn.toISOString());
        });
    });

    describe('sectionConnected:', function () {
        var courseId = 'courseId',
            sectionId = 'sectionId',
            connectedSectionId = 'obj1',
             vmSection = {
                 id: connectedSectionId,
                 title: ko.observable(""),
                 isSelected: ko.observable(false),
                 modifiedOn: ko.observable("")
             },
            section = { id: sectionId };

        beforeEach(function () {
            viewModel.id = courseId;
        });

        it('should be function', function () {
            expect(viewModel.sectionConnected).toBeFunction();
        });

        describe('when course is not current course', function () {
            it('should not add section', function () {
                viewModel.id = 'id';
                viewModel.connectedSections([]);

                viewModel.sectionConnected(courseId, section, 0);
                expect(viewModel.connectedSections().length).toBe(0);
            });
        });

        describe('when target index is not defined', function () {
            it('should push section', function () {
                viewModel.connectedSections([vmSection]);
                viewModel.sectionConnected(courseId, section, null);
                expect(viewModel.connectedSections()[1].id).toBe(sectionId);
            });
        });

        describe('when target index is defined', function () {
            it('should insert section', function () {
                viewModel.connectedSections([vmSection]);
                viewModel.sectionConnected(courseId, section, 0);
                expect(viewModel.connectedSections()[0].id).toBe(sectionId);
            });
        });

        it('should remove connected section from available sections list', function () {
            viewModel.availableSections([vmSection]);
            viewModel.sectionConnected(courseId, vmSection, 0);
            expect(viewModel.availableSections().length).toBe(0);
        });
    });

    describe('sectionsDisconnected:', function () {
        var courseId = 'courseId',
         connectedSectionId = 'obj1',
          vmSection = {
              id: connectedSectionId,
              title: ko.observable(""),
              isSelected: ko.observable(false),
              modifiedOn: ko.observable("")
          },
         getSectionsDefer;

        beforeEach(function () {
            getSectionsDefer = Q.defer();

            spyOn(sectionRepository, 'getCollection').and.returnValue(getSectionsDefer.promise);

            viewModel.id = courseId;
        });

        it('should be function', function () {
            expect(viewModel.sectionsDisconnected).toBeFunction();
        });

        describe('when course is not current course', function () {
            it('should not disconnect section', function () {
                viewModel.id = 'id';
                viewModel.connectedSections([vmSection]);

                viewModel.sectionsDisconnected(courseId, [vmSection.id]);
                expect(viewModel.connectedSections().length).toBe(1);
            });
        });

        it('should disconnect section', function () {
            viewModel.connectedSections([vmSection]);
            viewModel.sectionsDisconnected(courseId, [vmSection.id]);
            expect(viewModel.connectedSections().length).toBe(0);
        });

        describe('when get sections', function () {
            beforeEach(function () {
                getSectionsDefer.resolve([{ id: '0', title: 'B', createdBy: identity.email }, { id: '1', title: 'A', createdBy: identity.email }]);
            });


            describe('and course does not have related sections', function () {

                it('should set owned sections as available', function (done) {
                    viewModel.connectedSections([]);

                    viewModel.sectionsDisconnected(courseId, [vmSection.id]);

                    getSectionsDefer.promise.fin(function () {
                        expect(viewModel.availableSections().length).toBe(2);
                        done();
                    });
                });

            });

            describe('and course has related sections', function () {

                it('should set not related sections as available', function (done) {
                    viewModel.connectedSections([{ id: '0', title: 'B', isSelected: ko.observable(false) }]);

                    viewModel.sectionsDisconnected(courseId, [vmSection.id]);

                    getSectionsDefer.promise.fin(function () {
                        expect(viewModel.availableSections().length).toBe(1);
                        expect(viewModel.availableSections()[0].id).toBe('1');
                        done();
                    });
                });

            });

            it('should sort available sections by title', function (done) {
                viewModel.sectionsDisconnected(courseId, [vmSection.id]);

                getSectionsDefer.promise.fin(function () {
                    expect(viewModel.availableSections()).toBeSortedAsc('title');
                    done();
                });
            });

        });
    });

});
