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
            ModelBinderProviders.BinderProviders.Add(new LearningPathEntityModelBinderProvider());
            ModelBinderProviders.BinderProviders.Add(new LearningPathEntityCollectionModelBinderProvider());
            ModelBinderProviders.BinderProviders.Add(new SecureModelBinderProvider());
            ModelBinders.Binders.Add(typeof(DateTime?), new DateTimeModelBinder());
        }
    }
}