define(['plugins/router', 'help/helpHint'], function (router, helpHint) {

    var
        helpHintHeight,
        contentContainerSelector = '#content',
        helpHintSelector = '.help-hint',
        courseNavigationHolderSelector = '.course-navigation-holder',
        notFixedContainerSelector = '.view-module',
        fixedContainerSelector = '.view-module > .fixed-container:first-child',
        notifyContainerSelector = '.notify.fixed-container',
        backBtnSelector = '.nav-back-holder'
    ;

    function setHeight() {
        var headerHeight = $('.header').height(),
            paddingBeforeViewModule = 0;

        if ($(fixedContainerSelector).height() > 0) {
            paddingBeforeViewModule = $(fixedContainerSelector).height() - 9;
        } else {
            paddingBeforeViewModule = 20;
        }

        if (helpHint.visible()) {

            if ($(helpHintSelector).height() > 73) {
                helpHintHeight = $(helpHintSelector).height();
            } else {
                helpHintHeight = 0;
            }
        } else {
            helpHintHeight = 0;
        }

        var courseNavigationHeight = 0;
        if (!_.isNullOrUndefined($(courseNavigationHolderSelector).height())) {
            courseNavigationHeight = $(courseNavigationHolderSelector).height();
        }

        $(fixedContainerSelector).css('top', headerHeight + courseNavigationHeight + helpHintHeight + 'px');
        $(notifyContainerSelector).css('top', headerHeight + courseNavigationHeight + helpHintHeight + 'px');
        $(notFixedContainerSelector).css('padding-top', paddingBeforeViewModule + helpHintHeight + 'px');
        $(contentContainerSelector).css('min-height', 600 + helpHintHeight + 'px');
        $(backBtnSelector).css('padding-top', parseInt($(fixedContainerSelector).css('top')) + 14 + 'px');
    }

    $(window).resize(setHeight);

    router.on('router:navigation:composition-complete', function () {
        setHeight();
    });

    ko.computed(function () {
        var visible = helpHint.visible();
        setHeight();
    }).extend({ throttle: 1 });

})