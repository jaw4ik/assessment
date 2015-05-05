using System;
using System.Collections.Generic;
using System.IdentityModel.Protocols.WSTrust;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.ServiceModel.Security.Tokens;
using System.Threading.Tasks;
using System.Web.Mvc;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    [AllowAnonymous]
    public class AuthController : DefaultController
    {
        [Route("auth/token")]
        public string GetToken(string email, string password, string clientId)
        {
            
        }
    }

}
