define(['models/entity'],
   function (EntityModel) {
       "use strict";

       var Organization = function (spec) {
           var obj = new EntityModel(spec);

           obj.email = spec.email;
           obj.isAdmin = spec.isAdmin;
           obj.fullName = spec.fullName;
           obj.status = spec.status;
           obj.isRegistered = spec.isRegistered;
           
           return obj;
       };

       return Organization;
   }
);