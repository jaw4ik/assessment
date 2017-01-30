using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;

namespace easygenerator.Web.Controllers.Api
{
    public class UserDomainController: DefaultApiController
    {
        private readonly IUserDomainRepository _userDomainRepository;

        public UserDomainController(IUserDomainRepository userDomainRepository)
        {
            _userDomainRepository = userDomainRepository;
        }

        #region External api

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/userdomain/info")]
        public ActionResult GetUserDomainInfo(string domain)
        {
            if (domain == null)
                throw new ArgumentException(@"Domain name is not specified or specified in wrong format", nameof(domain));

            var userDomain = _userDomainRepository.Get(domain);
            if (userDomain == null)
                throw new ArgumentException(@"UserDomain with specified name does not exist", nameof(domain));

            return JsonDataResult(userDomain);
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/userdomain/add")]
        public ActionResult AddUserDomain(string domain, bool tracked = false)
        {
            if (domain == null)
                throw new ArgumentException(@"Domain name is not specified or specified in wrong format", nameof(domain));

            var userDomain =_userDomainRepository.Get(domain);
            if(userDomain != null)
                throw new ArgumentException(@"Domain with same name exists in database", nameof(domain));

            _userDomainRepository.Add(new UserDomain(domain, 0, tracked));

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/userdomain/update")]
        public ActionResult UpdateUserDomain(string domain, bool tracked)
        {
            if (domain == null)
                throw new ArgumentException(@"Domain name is not specified or specified in wrong format", nameof(domain));

            var userDomain = _userDomainRepository.Get(domain);
            if (userDomain == null)
                throw new ArgumentException(@"UserDomain with specified name does not exist", nameof(domain));
            
            userDomain.UpdateTrackedValue(tracked);
            return Success();
        }

        #endregion
    }
}