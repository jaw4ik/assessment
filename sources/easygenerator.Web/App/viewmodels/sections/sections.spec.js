import viewModel from './sections';
import ko from 'knockout';
import router from 'routing/router';
import eventTracker from 'eventTracker';
import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';
import uploadImage from 'images/commands/upload';
import createSectionCommand from 'commands/createSectionCommand';

describe('viewModel [sections]', function () {

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(createSectionCommand, 'execute');
        spyOn(notify, 'saved');
    });

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('sections:', function () {

        it('should be observable', function () {
            expect(viewModel.sections).toBeObservable();
        });

    });

    describe('updateSectionImage:', () => {

        let section;
        let viewModelUpdateSectionImage;
        let file;

        beforeEach(() => {
            file = 'some image file';
            section ={
                id: 'some_section_id',
                imageUrl: ko.observable(''),
                isImageLoading: ko.observable(false),
                modifiedOn: ko.observable(new Date())
            };
            viewModelUpdateSectionImage = viewModel.updateSectionImage.bind(section);
        });

        it(`should send event \'Open "change objective image" dialog\'`, () => {
            spyOn(uploadImage, 'execute').and.returnValue(Promise.resolve());
            viewModelUpdateSectionImage();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open "change objective image" dialog');
        });

        it('should start loading', () => {
            section.isImageLoading(false);
            spyOn(uploadImage, 'execute').and.returnValue(Promise.resolve());
            viewModelUpdateSectionImage(file);
            expect(section.isImageLoading()).toBeTruthy();
        });

        describe('when image uploading started', () => {

            describe('and when image uploading successfull', () => {

                let uploadImagePromise;
                let updateSectionImagePromise;
                let file;
                let imageUploadRes;
                let sectionUpdateImageRes;

                beforeEach(() => {
                    file = 'some image file';
                    imageUploadRes = {
                        id: 'someid',
                        title: 'title',
                        url: 'https://urla.com'
                    };
                    sectionUpdateImageRes = {
                        imageUrl: imageUploadRes.url
                    };
                    uploadImagePromise = Promise.resolve(imageUploadRes);
                    updateSectionImagePromise = Promise.resolve(sectionUpdateImageRes);
                    spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
                    spyOn(sectionRepository, 'updateImage').and.returnValue(updateSectionImagePromise);
                });

                it('should upload image to image storage', () => {
                    viewModelUpdateSectionImage(file);
                    expect(uploadImage.execute).toHaveBeenCalledWith(file);
                });

                it('should update section image on the server', done => (async () => {
                    viewModelUpdateSectionImage(file);
                    await uploadImagePromise;
                    expect(sectionRepository.updateImage).toHaveBeenCalledWith(section.id, imageUploadRes.url);
                })().then(done));

                it('should update section image', done => (async () => {
                    viewModelUpdateSectionImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(section.imageUrl()).toBe(sectionUpdateImageRes.imageUrl);
                })().then(done));

                it('should show saved notification', done => (async () => {
                    viewModelUpdateSectionImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(notify.saved).toHaveBeenCalled();
                })().then(done));

                it('should stop image uploading', done => (async () => {
                    section.isImageLoading(true);
                    viewModelUpdateSectionImage(file);
                    await uploadImagePromise;
                    await updateSectionImagePromise;
                    expect(section.isImageLoading()).toBeFalsy();
                })().then(done));
            });

        });

    });

    describe('currentLanguage:', function () {

        it('should be defined', function () {
            expect(viewModel.currentLanguage).toBeDefined();
        });

    });

    describe('createSection', function () {

        it('should be a function', function () {
            expect(viewModel.createSection).toBeFunction();
        });

        it('should execute create section command', function () {
            viewModel.createSection();
            expect(createSectionCommand.execute).toHaveBeenCalled();
        });
    });

    describe('navigateToDetails', function () {

        it('should be a function', function () {
            expect(viewModel.navigateToDetails).toBeFunction();
        });

        it('should send event \'Navigate to objective details\'', function () {
            viewModel.navigateToDetails({ id: 1 });
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
        });

        it('should navigate to #/section/{id}', function () {
            var sectionId = 1;
            viewModel.navigateToDetails({ id: sectionId });
            expect(router.navigate).toHaveBeenCalledWith('library/sections/' + sectionId);
        });

    });

    describe('navigateToCourses', function () {

        it('should be a function', function () {
            expect(viewModel.navigateToCourses).toBeFunction();
        });

        it('should send event \'Navigate to courses\'', function () {
            viewModel.navigateToCourses();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
        });

        it('should navigate to #/courses', function () {
            viewModel.navigateToCourses();
            expect(router.navigate).toHaveBeenCalledWith('courses');
        });

    });

    describe('toggleSectionSelection:', function () {

        it('should be a function', function () {
            expect(viewModel.toggleSectionSelection).toBeFunction();
        });

        describe('when section is null', function () {
            it('should throw exception', function () {
                var f = function () { viewModel.toggleSectionSelection(null); };
                expect(f).toThrow();
            });
        });

        describe('when section is undefined', function () {
            it('should throw exception', function () {
                var f = function () { viewModel.toggleSectionSelection(); };
                expect(f).toThrow();
            });
        });

        describe('when section does not have isSelected() observable', function () {
            it('should throw exception', function () {
                var f = function () { viewModel.toggleSectionSelection({}); };
                expect(f).toThrow();
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
    });

    describe('activate:', function () {

        var
            getSectionsDeferred,
            getCoursesDeferred;
        var createdBy = 'user';

        beforeEach(function () {
            getSectionsDeferred = Q.defer();
            getCoursesDeferred = Q.defer();

            spyOn(sectionRepository, 'getCollection').and.returnValue(getSectionsDeferred.promise);
            spyOn(courseRepository, 'getCollection').and.returnValue(getCoursesDeferred.promise);
            userContext.identity = { email: createdBy };
        });

        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            var promise = viewModel.activate();
            expect(promise).toBePromise();
        });

        it('should call section repository getCollection', function () {
            viewModel.activate();
            expect(sectionRepository.getCollection).toHaveBeenCalled();
        });

        describe('when sections have been recieved', function () {

            var sectionItem = { id: '1', title: 'z', image: 'image/url', questions: [{ id: 0 }, { id: 1 }], modifiedOn: 'some date', createdBy: createdBy };
            var sectionsCollection = [
                sectionItem,
                { id: '2', title: 'a', image: '', questions: [{}, {}], createdBy: createdBy },
                { id: '3', title: 'A', image: '', questions: [{}, {}], createdBy: createdBy },
                { id: '4', title: 'c', image: '', questions: [{}, {}], createdBy: createdBy },
                { id: '5', title: 'B', image: '', questions: [{}, {}], createdBy: createdBy },
                { id: '6', title: 'D', image: '', questions: [{}, {}], createdBy: 'anonym' }
            ];

            beforeEach(function () {
                viewModel.sections([]);
            });

            describe('and when section received', function () {

                it('should call course repository getCollection', function (done) {
                    viewModel.activate();
                    getSectionsDeferred.resolve(sectionsCollection);

                    getSectionsDeferred.promise.fin(function () {
                        expect(courseRepository.getCollection).toHaveBeenCalled();
                        done();
                    });
                });

                describe('and when courses have been received', function () {

                    it('should define sections', function (done) {
                        getSectionsDeferred.resolve(sectionsCollection);
                        getCoursesDeferred.resolve([]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections().length).toBeGreaterThan(0);
                            done();
                        });
                    });

                    it('should filter shared sections', function (done) {
                        getSectionsDeferred.resolve(sectionsCollection);
                        getCoursesDeferred.resolve([]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections().length).toBe(sectionsCollection.length - 1);
                            done();
                        });
                    });

                    it('should set id for each section', function (done) {
                        getSectionsDeferred.resolve([sectionItem]);
                        getCoursesDeferred.resolve([]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()[0].id).toBe(sectionItem.id);
                            done();
                        });
                    });

                    it('should set title for each section', function (done) {
                        getCoursesDeferred.resolve([]);
                        getSectionsDeferred.resolve([sectionItem]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()[0].title()).toBe(sectionItem.title);
                            done();
                        });
                    });

                    it('should set imageUrl for each section', function (done) {
                        getCoursesDeferred.resolve([]);
                        getSectionsDeferred.resolve([sectionItem]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()[0].imageUrl()).toBe(sectionItem.image);
                            done();
                        });
                    });

                    it('should set isImageLoading for each section', function (done) {
                        getCoursesDeferred.resolve([]);
                        getSectionsDeferred.resolve([sectionItem]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()[0].isImageLoading()).toBeFalsy();
                            done();
                        });
                    });

                    it('should set modifiedOn for each section', function (done) {
                        getCoursesDeferred.resolve([]);
                        getSectionsDeferred.resolve([sectionItem]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()[0].modifiedOn()).toBe(sectionItem.modifiedOn);
                            done();
                        });
                    });

                    it('should set isSelected observable to false for each section', function (done) {
                        getCoursesDeferred.resolve([]);
                        getSectionsDeferred.resolve([sectionItem]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()[0].isSelected()).toBeFalsy();
                            done();
                        });
                    });

                    describe('when section questions count > 0', function () {

                        it('should set canBeDeleted to true for each section', function (done) {
                            getCoursesDeferred.resolve([]);
                            getSectionsDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [{ id: 0 }, { id: 1 }], createdBy: createdBy }]);

                            var promise = viewModel.activate();

                            promise.fin(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.sections()[0].canBeDeleted).toBeTruthy();
                                done();
                            });
                        });

                    });

                    describe('when section questions count = 0', function () {

                        describe('when sections count included to expiriences = 0', function () {

                            it('should set canBeDeleted to true for each section', function (done) {
                                getCoursesDeferred.resolve([]);
                                getSectionsDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [], createdBy: createdBy }]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.sections()[0].canBeDeleted).toBeTruthy();
                                    done();
                                });
                            });
                        });

                        describe('when section is included to expirience', function () {

                            it('should set canBeDeleted to false', function (done) {
                                getCoursesDeferred.resolve([{ sections: [{ id: '1' }] }]);
                                getSectionsDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [], createdBy: createdBy }]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.sections()[0].canBeDeleted).toBeFalsy();
                                    done();
                                });
                            });
                        });

                    });

                    it('should sort sections collection desc by created on', function (done) {
                        getSectionsDeferred.resolve(sectionsCollection);
                        getCoursesDeferred.resolve([]);

                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(viewModel.sections()).toBeSortedDesc('createdOn');
                            done();
                        });
                    });

                });

            });

        });

        it('should set currentLanguage', function () {
            viewModel.currentLanguage = null;
            viewModel.activate();
            expect(viewModel.currentLanguage).toBe(localizationManager.currentLanguage);
        });

    });

    describe('enableDeleteSections:', function () {

        it('should be computed', function () {
            expect(viewModel.enableDeleteSections).toBeComputed();
        });

        describe('when no selected sections', function () {
            it('should be false', function () {
                viewModel.sections([{ isSelected: ko.observable(false) }]);
                expect(viewModel.enableDeleteSections()).toBeFalsy();
            });
        });

        describe('when 1 section is selected', function () {
            it('should be true', function () {
                viewModel.sections([{ isSelected: ko.observable(true) }]);
                expect(viewModel.enableDeleteSections()).toBeTruthy();
            });
        });

        describe('when there are few sections selected', function () {
            it('should be false', function () {
                viewModel.sections([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                expect(viewModel.enableDeleteSections()).toBeTruthy();
            });
        });
    });

    describe('deleteSelectedSections:', function () {

        beforeEach(function () {
            spyOn(notify, 'info');
        });

        it('should be function', function () {
            expect(viewModel.deleteSelectedSections).toBeFunction();
        });

        it('should send event \'Delete selected objectives\'', function () {
            viewModel.sections([{ isSelected: ko.observable(true) }]);
            viewModel.deleteSelectedSections();
            expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives');
        });

        describe('when no selected sections', function () {
            it('should throw exception', function () {
                viewModel.sections([{ isSelected: ko.observable(false) }]);

                var f = function () {
                    viewModel.deleteSelectedSections();
                };
                expect(f).toThrow();
            });
        });

        describe('when there are few selected sections', function () {
            it('should show error notification', function () {
                viewModel.sections([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                spyOn(notify, 'error');

                viewModel.deleteSelectedSections();
                expect(notify.error).toHaveBeenCalled();
            });
        });

        describe('when there is only 1 selected section', function () {

            describe('and when section cannot be deleted', function () {
                beforeEach(function () {
                    viewModel.sections([{ isSelected: ko.observable(true), canBeDeleted: false }]);
                    spyOn(notify, 'error');
                });

                it('should send event \'Delete selected objectives\'', function () {
                    viewModel.deleteSelectedSections();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives');
                });

                it('should return undefined', function () {
                    var result = viewModel.deleteSelectedSections();
                    expect(result).toBeUndefined();
                });

                it('should show error notification', function () {
                    viewModel.deleteSelectedSections();
                    expect(notify.error).toHaveBeenCalled();
                });
            });

            describe('and when section can be deleted', function () {
                var deleteDeferred,
                    selectedSection = {
                        id: 0,
                        isSelected: ko.observable(true),
                        canBeDeleted: true
                    };

                beforeEach(function () {
                    viewModel.sections([selectedSection]);
                    deleteDeferred = Q.defer();
                    spyOn(sectionRepository, 'removeSection').and.returnValue(deleteDeferred.promise);
                });

                it('should delete section in repository', function (done) {
                    deleteDeferred.resolve();

                    viewModel.deleteSelectedSections();

                    deleteDeferred.promise.fin(function () {
                        expect(deleteDeferred.promise).toBeResolved();
                        expect(sectionRepository.removeSection).toHaveBeenCalledWith(selectedSection.id);
                        done();
                    });
                });

                it('should delete section in view model', function (done) {
                    deleteDeferred.resolve();

                    viewModel.deleteSelectedSections();

                    deleteDeferred.promise.fin(function () {
                        expect(deleteDeferred.promise).toBeResolved();
                        expect(viewModel.sections().length).toBe(0);
                        done();
                    });
                });

                it('should show saved notification', function (done) {
                    deleteDeferred.resolve();

                    viewModel.deleteSelectedSections();

                    deleteDeferred.promise.fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });
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
            viewModel.sections([vmSection]);
            viewModel.sectionImageUpdated(section);

            expect(vmSection.imageUrl()).toBe(section.image);
        });

        it('should update course modified on date', function () {
            viewModel.sections([vmSection]);
            viewModel.sectionImageUpdated(section);

            expect(vmSection.modifiedOn().toISOString()).toBe(section.modifiedOn.toISOString());
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
            viewModel.sections([vmSection]);
            viewModel.sectionTitleUpdated(section);

            expect(vmSection.title()).toBe(section.title);
        });

        it('should update course modified on date', function () {
            viewModel.sections([vmSection]);
            viewModel.sectionTitleUpdated(section);

            expect(vmSection.modifiedOn().toISOString()).toBe(section.modifiedOn.toISOString());
        });

    });

});
