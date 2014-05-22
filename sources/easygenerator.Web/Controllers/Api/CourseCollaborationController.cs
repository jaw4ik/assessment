using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class CourseCollaborationController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IUserRepository _userRepository;

        public CourseCollaborationController(IEntityFactory entityFactory, IUserRepository userRepository)
        {
            _entityFactory = entityFactory;
            _userRepository = userRepository;
        }

        [HttpPost]
        [CourseOwner]
        [Route("api/course/collaborator/add")]
        public ActionResult AddCollaborator(Course course, string email)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var user = _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return JsonLocalizableError(Errors.UserWithSpecifiedEmailDoesntExist, Errors.UserWithSpecifiedEmailDoesntExistResourceKey);
            }

            if (!course.CollaborateWithUser(user, GetCurrentUsername()))
            {
                return JsonSuccess(true);
            }

            return JsonSuccess(new
            {
                Email = user.Email,
                FullName = user.FullName
            });
        }
    }
}