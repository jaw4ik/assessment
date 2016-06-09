﻿define(['models/entity'],
   function (EntityModel) {
       "use strict";

       var Organization = function (spec) {
           var obj = new EntityModel(spec);

           obj.organizationId = spec.organizationId;
           obj.organizationAdminFirstName = spec.organizationAdminFirstName;
           obj.organizationAdminLastName = spec.organizationAdminLastName;
           obj.organizationTitle = spec.organizationTitle;

           return obj;
       };

       return Organization;
   }
);