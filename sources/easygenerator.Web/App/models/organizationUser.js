define(['models/entity'],
   function (EntityModel) {
       "use strict";

       var Organization = function (spec) {
           var obj = new EntityModel(spec);

           obj.email = spec.email;
           obj.isAdmin = spec.isAdmin;
           obj.isRegistered = spec.isRegistered;
           obj.fullName = spec.fullName;
           obj.isAccepted = spec.isAccepted;

           return obj;
       };

       return Organization;
   }
);