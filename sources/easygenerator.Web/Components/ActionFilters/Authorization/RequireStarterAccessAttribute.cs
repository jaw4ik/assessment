﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class RequireStarterAccessAttribute : FilterAttribute, IAuthorizationFilter
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
            if (!user.HasStarterAccess())
            {
                authorizationContext.Result = new ForbiddenResult(ErrorMessageResourceKey);
            }
        }
    }
}