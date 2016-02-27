using System;
using System.Web.Mvc;
using easygenerator.Auth.Security.Models;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.ModelBinding
{
    public class SecureModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(Type modelType)
        {
            if (!typeof(ISecure<>).IsGenericTypeAssignableFrom(modelType))
                return null;

            var modelBinderType = typeof(ISecureModelBinder<>).MakeGenericType(modelType);
            return (IModelBinder)DependencyResolver.Current.GetService(modelBinderType);
        }
    }
}