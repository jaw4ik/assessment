define(['durandal/activator', 'viewmodels/panels/tabs/reviewTab', 'viewmodels/panels/tabs/feedbackTab'],
    function (activator, reviewTab, feedbackTab) {

        var viewModel = {
            activeTab: ko.observable(),
            tabs: [feedbackTab, reviewTab],
            activate: activate,
            toggleTabVisibility: toggleTabVisibility,
            onCollapsed: onCollapsed,
            isExpanded: ko.observable(false)
        };

        return viewModel;

        function activate() {
            return Q.fcall(function () {
                viewModel.activeTab(null);
            });
        }
        
        function toggleTabVisibility(tab) {
            var isTabActive = viewModel.activeTab() == tab;
            if (!isTabActive) {
                viewModel.activeTab(tab);
            }

            viewModel.isExpanded(!isTabActive);
        }

        function onCollapsed() {
            viewModel.activeTab(null);
        }
    }
);