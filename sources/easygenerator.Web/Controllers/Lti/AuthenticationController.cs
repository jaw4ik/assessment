using System.Web.Mvc;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers.Lti
{
    [NoCache]
    public class AuthenticationController : DefaultApiController
    {
        [HttpPost, AllowAnonymous]
        [Route("lti/authenticate")]
        public ActionResult Authenticate()
        {
            //if (grant_type == "password")
            //{
            //    var user = _repository.GetUserByEmail(username);
            //    if (user != null && user.VerifyPassword(password))
            //    {
            //        var tokens = _tokenProvider.GenerateTokens(username, Request.Url.Host, endpoints);
            //        return JsonSuccess(tokens);
            //    }
            //}
            //return JsonError(AccountRes.Resources.IncorrectEmailOrPassword);
            return null;
        }
    }
}