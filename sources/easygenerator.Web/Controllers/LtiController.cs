using System.Collections.Generic;
using System.Web.Mvc;
using easygenerator.Auth.Models;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    [AllowAnonymous]
    public class LtiController : DefaultController
    {
        private readonly IDictionaryStorage _storage;

        public LtiController(IDictionaryStorage storage)
        {
            _storage = storage;
        }

        [HttpPost]
        [Route("lti/authenticate")]
        public ActionResult Authenticate()
         {
            var tokens = _storage.Get<List<TokenModel>>(Lti.Constants.TokensStorageKey);
            if (tokens != null)
            {
                return JsonSuccess(tokens);
            }

            return JsonError("Cannot authenticate lti user.");
        }
    }
}