using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    [AllowAnonymous]
    public class LtiController : DefaultController
    {
        [HttpPost]
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