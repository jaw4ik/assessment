using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace easygenerator.Auth.Controllers
{
    public class AuthController : ApiController
    {
        [Route("auth/token"), AllowAnonymous]
        public string Token(string username, string password, string grant_type, string scope)
        {
            return "Token";
        }
    }
}
