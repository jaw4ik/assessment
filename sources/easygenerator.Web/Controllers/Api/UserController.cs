using System.Web.Mvc;
using System.Web.Security;
using AccountRes;
using easygenerator.DomainModel;
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

        public UserController(IUserRepository repository, IEntityFactory entityFactory, IAuthenticationProvider authenticationProvider)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _authenticationProvider = authenticationProvider;
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

            _repository.Add(_entityFactory.User(email, password, email));
            _authenticationProvider.SignIn(email, true);

            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult Exists(string email)
        {
            var exists = _repository.GetUserByEmail(email) != null;
            return JsonSuccess(exists);
        }
    }
}
