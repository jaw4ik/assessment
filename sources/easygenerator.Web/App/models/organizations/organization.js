define(['models/entity'],
   function (EntityModel) {
       "use strict";

       var Organization = function (spec) {

           var obj = new EntityModel(spec);

           obj.title = spec.title;
           obj.grantsAdminAccess = spec.grantsAdminAccess;

           return obj;
       };

       return Organization;
   }
);