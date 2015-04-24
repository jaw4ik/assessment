using System.Web.Mvc;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class PlusAccessAttribute : AccessAttribute
    {
        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            return user != null && user.HasPlusAccess();
        }
    }
}