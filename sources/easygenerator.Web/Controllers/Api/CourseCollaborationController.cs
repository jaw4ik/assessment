using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using System.Web.Mvc;
using easygenerator.Web.Mail;

namespace easygenerator.Web.Controllers.Api
{
    public class CourseCollaborationController : DefaultController
    {
        private readonly IUserRepository _userRepository;
        private readonly IEntityModelMapper<CourseCollaborator> _collaboratorEntityModelMapper;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IMailSenderWrapper _mailSenderWrapper;

        public CourseCollaborationController(IUserRepository userRepository, IDomainEventPublisher eventPublisher,
            IEntityModelMapper<CourseCollaborator> collaboratorEntityModelMapper, IMailSenderWrapper mailSenderWrapper)
        {
            _userRepository = userRepository;
            _collaboratorEntityModelMapper = collaboratorEntityModelMapper;
            _eventPublisher = eventPublisher;
            _mailSenderWrapper = mailSenderWrapper;
        }

        [HttpPost]
        [EntityOwner(typeof(Course))]
        [Route("api/course/collaborator/add")]
        public ActionResult AddCollaborator(Course course, string email)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var authorName = GetCurrentUsername();
            var collaborator = course.Collaborate(email, authorName);
            if (collaborator == null)
            {
                return JsonSuccess(true);
            }

            var user = _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                var author = _userRepository.GetUserByEmail(authorName);

                _mailSenderWrapper.SendInviteCollaboratorMessage(author.Email, email, author.FullName, course.Title);
            }

            var courseCollaboratorAddedEvent = new CourseCollaboratorAddedEvent(collaborator, authorName);
            _eventPublisher.Publish(courseCollaboratorAddedEvent);

            return JsonSuccess(_collaboratorEntityModelMapper.Map(collaborator));
        }
    }
}