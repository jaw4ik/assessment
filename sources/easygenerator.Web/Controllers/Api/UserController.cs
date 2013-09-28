using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Controllers.Api
{
    public class UserController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IUserRepository _repository;

        public UserController(IUserRepository repository, IEntityFactory entityFactory)
        {
            _repository = repository;
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult Signup(string email, string password)
        {
            if (_repository.GetUserByEmail(email) != null)
            {
                return new JsonErrorResult("Account with this email already exists");
            }

            _repository.Add(_entityFactory.User(email, password));

            return JsonSuccess();
        }
    }
}
