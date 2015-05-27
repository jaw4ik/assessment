using easygenerator.Auth.Attributes.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionResults;
using System;
using System.Net;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    [Scope("api")]
    public abstract class DefaultApiController : DefaultController{ }
}