using System.Web.Mvc;
using easygenerator.Auth.Security.Providers;

namespace easygenerator.Web.Components.ModelBinding
{
    public interface ISecureModelBinder<T> : IModelBinder { }

    public class SecureModelBinder<T> : ISecureModelBinder<T>
    {
        private readonly ISecureTokenProvider<T> _secureTokenProvider;

        public SecureModelBinder()
        {
            _secureTokenProvider = DependencyResolver.Current.GetService<ISecureTokenProvider<T>>();
        }

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var token = bindingContext.ValueProvider.GetValue("token");
            return _secureTokenProvider.GetDataFromToken(token.AttemptedValue);
        }
    }
}