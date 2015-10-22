using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class AcademyAccessAttribute : AccessAttribute
    {
        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            return user != null && user.HasAcademyAccess();
        }
    }
}