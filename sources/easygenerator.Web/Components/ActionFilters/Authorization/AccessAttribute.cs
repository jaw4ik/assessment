using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.ActionResults;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public abstract class AccessAttribute : FilterAttribute, IAuthorizationFilter
    {
        public string ErrorMessageResourceKey { get; set; }
        public IUserRepository UserRepository { get; set; }

        public void OnAuthorization(AuthorizationContext authorizationContext)
        {
            if (authorizationContext == null)
            {
                throw new ArgumentNullException("authorizationContext");
            }

            if (authorizationContext.Result != null)
            {
                return;
            }

            var httpContext = authorizationContext.HttpContext;
            if (authorizationContext.HttpContext == null ||
                authorizationContext.HttpContext.User == null ||
                authorizationContext.HttpContext.User.Identity == null ||
                !authorizationContext.HttpContext.User.Identity.IsAuthenticated)
            {
                throw new InvalidOperationException();
            }

            var user = UserRepository.GetUserByEmail(httpContext.User.Identity.Name);

            if (user == null || !CheckAccess(authorizationContext, user))
            {
                Reject(authorizationContext);
            }
        }

        protected abstract bool CheckAccess(AuthorizationContext authorizationContext, User user);

        protected virtual void Reject(AuthorizationContext authorizationContext)
        {
            authorizationContext.Result = new ForbiddenResult(ErrorMessageResourceKey);
        }
    }
}