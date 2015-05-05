using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DotNetOpenAuth.Messaging;
using DotNetOpenAuth.OAuth2;

namespace easygenerator.Web.Auth.Controllers
{
    [AllowAnonymous]
    public class AuthController : Controller
    {
        private readonly AuthorizationServer authorizationServer = new AuthorizationServer(new AuthorizationServerHost());

        /// <summary>
        /// The OAuth 2.0 token endpoint.
        /// </summary>
        /// <returns>The response to the Client.</returns>
        public ActionResult Token()
        {
            return authorizationServer.HandleTokenRequest(Request).AsActionResult();
        }

        [Route("auth/login"), HttpGet, AllowAnonymous]
        public string Login(string name, string password)
        {

            return "ok";
        }
    }
}