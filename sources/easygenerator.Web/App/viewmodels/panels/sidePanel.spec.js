define(['viewmodels/panels/sidePanel'],
    function (viewModel) {

        describe('viewModel [sidePanel]', function () {

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activeTab:', function () {

                it('should be observable', function () {
                    expect(viewModel.activeTab).toBeObservable();
                });

            });

            describe('isExpanded:', function() {
                it('should be observable', function() {
                    expect(viewModel.isExpanded).toBeObservable();
                });
            });

            describe('tabs:', function () {

                it('should be an array', function () {
                    expect(viewModel.tabs).toBeArray();
                });

            });

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate()).toBePromise();
                });

                it('should clear active tab', function () {
                    viewModel.activeTab({});

                    var promise = viewModel.activate().fin(function () { });

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.activeTab()).toBe(null);
                    });
                });
            });

            describe('toggleTabVisibility:', function () {

                it('should be function', function () {
                    expect(viewModel.toggleTabVisibility).toBeFunction();
                });

                var tab = {};

                describe('when tab is active', function () {
                    beforeEach(function () {
                        viewModel.activeTab(tab);
                    });
                    
                    it('should not change activeTab', function () {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.activeTab()).toBe(tab);
                    });

                    it('should set isExpanded to false', function () {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.isExpanded()).toBeFalsy();
                    });

                });

                describe('when tab is not active', function () {
                    beforeEach(function () {
                        viewModel.activeTab(null);
                    });

                    it('should set activeTab to tab', function() {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.activeTab()).toBe(tab);
                    });

                    it('should set isExpanded to true', function() {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.isExpanded()).toBeTruthy();
                    });
                });

            });

            describe('onCollapsed:', function () {

                it('should be function', function () {
                    expect(viewModel.onCollapsed).toBeFunction();
                });

                it('should reset active tab', function () {
                    viewModel.activeTab({});

                    viewModel.onCollapsed();

                    expect(viewModel.activeTab()).toBe(null);
                });

            });
        });

    }
);