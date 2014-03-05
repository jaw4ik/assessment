define(['eventTracker', 'plugins/router'],
   function (eventTracker, router) {
       return function (itemId, itemTitle, itemEventName) {

           this.title = itemTitle;

           this.navigate = function () {
               eventTracker.publish(itemEventName);
               router.navigate(itemId + '/' + router.routeData().courseId);
           };

           this.navigationLink = ko.computed(function () {
               return '#' + itemId + '/' + router.routeData().courseId;
           });

           this.isActive = ko.computed(function () {
               return router.routeData().moduleName == itemId;
           });

           this.isRootView = ko.computed(function () {
               return router.routeData().moduleName == itemId;
           });
       };
   });
