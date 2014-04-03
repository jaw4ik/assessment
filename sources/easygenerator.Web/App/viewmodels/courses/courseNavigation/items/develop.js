﻿define(['viewmodels/courses/courseNavigation/items/navigationItem', 'plugins/router'],
     function (NavigationItem, router) {
         return function () {
             NavigationItem.call(this, 'course', 'courseCreateItem', 'Navigate to develop course');

             this.isActive = ko.computed(function () {
                 return router.routeData().moduleName != "design" && router.routeData().moduleName != "deliver";
             });
         };
     });