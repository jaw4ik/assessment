define(['dialogs/learningPath/defaultPublish'], function (viewModel) {

    var eventTracker = require('eventTracker');

    describe('dialog learningPath model [defaultPublish]', function () {

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('publishAction:', function () {
            it('should be defined', function () {
                expect(viewModel.publishAction).toBeDefined();
            });
        });

        describe('embedTabOpened:', function() {
            it('should be observable', function() {
                expect(viewModel.embedTabOpened).toBeObservable();
            });
        });

        describe('linkTabOpened:', function() {
            it('should be observable', function() {
                expect(viewModel.linkTabOpened).toBeObservable();
            });
        });

        describe('openEmbedTab:', function() {
            it('should be function', function() {
                expect(viewModel.openEmbedTab).toBeFunction();
            });

            describe('when emded tab opened', function() {
                beforeEach(function() {
                    viewModel.embedTabOpened(true);
                });

                it('should not publish event', function() {
                    viewModel.openEmbedTab();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });
            });

            describe('when emded tab not opened', function() {
                beforeEach(function() {
                    viewModel.embedTabOpened(false);
                });

                it('should publish \'Open embed tab\' event', function() {
                    viewModel.openEmbedTab();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open embed tab', 'Header');
                });

                it('should hide link tab', function() {
                    viewModel.linkTabOpened(null);
                    viewModel.openEmbedTab();
                    expect(viewModel.linkTabOpened()).toBeFalsy();
                });

                it('should open embed code tab', function() {
                    viewModel.openEmbedTab();
                    expect(viewModel.embedTabOpened()).toBeTruthy();
                });
            });
        });

        describe('openLinkTab:', function () {
            it('should be function', function () {
                expect(viewModel.openLinkTab).toBeFunction();
            });

            describe('when link tab opened', function () {
                beforeEach(function () {
                    viewModel.linkTabOpened(true);
                });

                it('should not publish event', function () {
                    viewModel.openLinkTab();
                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });
            });

            describe('when link tab not opened', function () {
                beforeEach(function () {
                    viewModel.linkTabOpened(false);
                });

                it('should publish \'Open link tab\' event', function () {
                    viewModel.openLinkTab();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open link tab', 'Header');
                });

                it('should hide embed tab', function () {
                    viewModel.embedTabOpened(null);
                    viewModel.openLinkTab();
                    expect(viewModel.embedTabOpened()).toBeFalsy();
                });

                it('should open link code tab', function () {
                    viewModel.openLinkTab();
                    expect(viewModel.linkTabOpened()).toBeTruthy();
                });
            });
        });
        
        describe('activate:', function () {
            beforeEach(function () {
                viewModel.publishAction = { activate: function () { } };
                spyOn(viewModel.publishAction, 'activate').and.returnValue(Q.defer().promise);
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should activate publishAction', function () {
                viewModel.activate('learningPathId');
                expect(viewModel.publishAction.activate).toHaveBeenCalledWith('learningPathId');
            });
        });

        describe('deactivate:', function () {
            beforeEach(function () {
                viewModel.publishAction = { deactivate: function () { } };
                spyOn(viewModel.publishAction, 'deactivate').and.returnValue(Q.defer().promise);
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.deactivate()).toBePromise();
            });

            it('should deactivate publishAction', function () {
                viewModel.deactivate();
                expect(viewModel.publishAction.deactivate).toHaveBeenCalled();
            });
        });
    });

});