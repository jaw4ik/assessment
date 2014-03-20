﻿
using easygenerator.Web.Components.ModelBinding;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Configuration
{
    public class ModelBinderConfiguration
    {
        public static void Configure()
        {
            ModelBinderProviders.BinderProviders.Add(new EntityModelBinderProvider());
            ModelBinderProviders.BinderProviders.Add(new EntityCollectionModelBinderProvider());
            ModelBinders.Binders.Add(typeof(DateTime?), new DateTimeModelBinder());
        }
    }
}