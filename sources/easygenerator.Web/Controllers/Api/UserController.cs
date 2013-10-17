using System.Web.Mvc;
using AccountRes;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.ViewModels.Account;
using easygenerator.DomainModel.Events;

namespace easygenerator.Web.Controllers.Api
{
    [AllowAnonymous]
    public class UserController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IUserRepository _repository;
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly ISignupFromTryItNowHandler _signupFromTryItNowHandler;
        private readonly IHelpHintRepository _helpHintRepository;
        private readonly IDomainEventPublisher<UserSignedUpEvent> _publisher;

        public UserController(IUserRepository repository, IEntityFactory entityFactory, IAuthenticationProvider authenticationProvider, ISignupFromTryItNowHandler signupFromTryItNowHandler,
            IHelpHintRepository helpHintRepository, IDomainEventPublisher<UserSignedUpEvent> publisher)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _authenticationProvider = authenticationProvider;
            _signupFromTryItNowHandler = signupFromTryItNowHandler;
            _helpHintRepository = helpHintRepository;
            _publisher = publisher;
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
        public ActionResult Signup(UserSecondStepViewModel profile)
        {
            var profileFromFirstStep = Session[Constants.SessionConstants.UserSignUpModel] as UserSignUpViewModel;
            if (profileFromFirstStep != null)
            {
                profile.Email = profileFromFirstStep.Email;
                profile.Password = profileFromFirstStep.Password;
                profile.FullName = profileFromFirstStep.FullName;
                profile.Organization = profileFromFirstStep.Organization;
                profile.Phone = profileFromFirstStep.Phone;
            }

            if (_repository.GetUserByEmail(profile.Email) != null)
            {
                return JsonError("Account with this email already exists");
            }

            var user = _entityFactory.User(profile.Email, profile.Password, profile.Email);

            user.UpdateFullName(profile.FullName, profile.Email);
            user.UpdatePhone(profile.Phone, profile.Email);
            user.UpdateOrganization(profile.Organization, profile.Email);

            _repository.Add(user);
            _publisher.Publish(new UserSignedUpEvent(user, profile.PeopleBusyWithCourseDevelopmentAmount, profile.NeedAuthoringTool, profile.UsedAuthoringTool));

            _helpHintRepository.CreateHelpHintsForUser(profile.Email);

            if (User.Identity.IsAuthenticated && _repository.GetUserByEmail(User.Identity.Name) == null)
            {
                _signupFromTryItNowHandler.HandleOwnership(User.Identity.Name, user.Email);
            }

            _authenticationProvider.SignIn(profile.Email, true);

            Session[Constants.SessionConstants.UserSignUpModel] = null;

            return JsonSuccess(profile.Email);
        }

        [HttpPost]
        public ActionResult SignUpFirstStep(UserSignUpViewModel profile)
        {
            if (_repository.GetUserByEmail(profile.Email) != null)
            {
                return JsonError("Account with this email already exists");
            }

            Session[Constants.SessionConstants.UserSignUpModel] = profile;

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
