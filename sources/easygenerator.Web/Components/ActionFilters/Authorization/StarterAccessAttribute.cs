using easygenerator.DomainModel.Entities;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class StarterAccessAttribute : AccessAttribute
    {
        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            return user != null &&  user.HasStarterAccess();
        }
    }
}