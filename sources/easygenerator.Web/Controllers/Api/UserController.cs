using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using AccountRes;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    [AllowAnonymous]
    public class UserController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IUserRepository _repository;
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly ISignupFromTryItNowHandler _signupFromTryItNowHandler;

        public UserController(IUserRepository repository, IEntityFactory entityFactory, IAuthenticationProvider authenticationProvider, ISignupFromTryItNowHandler signupFromTryItNowHandler)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _authenticationProvider = authenticationProvider;
            _signupFromTryItNowHandler = signupFromTryItNowHandler;
        }

        [HttpPost]
        public ActionResult Signin(string username, string password)
        {
            var user = _repository.GetUserByEmail(username);
            if (user == null || !user.VerifyPassword(password))
            {
                return JsonError(Resources.IncorrectEmailOrPassword);
            }

            _authenticationProvider.SignIn(username, true);
            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult Signup(string email, string password)
        {
            if (_repository.GetUserByEmail(email) != null)
            {
                return JsonError("Account with this email already exists");
            }

            var user = _entityFactory.User(email, password, email);

            _repository.Add(user);

            if (User.Identity.IsAuthenticated && _repository.GetUserByEmail(User.Identity.Name) == null)
            {
                _signupFromTryItNowHandler.HandleOwnership(User.Identity.Name, user.Email);
            }

            _authenticationProvider.SignIn(email, true);

            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult Exists(string email)
        {
            var exists = _repository.GetUserByEmail(email) != null;
            return JsonSuccess(exists);
        }

        [HttpGet]
        public ActionResult IsTryMode()
        {
            var isTryMode = _repository.GetUserByEmail(GetCurrentUsername()) == null;
            return JsonSuccess(isTryMode);
        }

        [HttpGet]
        public ActionResult GetCurrentUserEmail()
        {
            if (User.Identity.IsAuthenticated && _repository.GetUserByEmail(User.Identity.Name) != null)
            {
                return JsonSuccess(new { Email = User.Identity.Name });
            }
            return JsonSuccess();
        }
    }
}
