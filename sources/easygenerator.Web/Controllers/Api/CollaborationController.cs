using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Mail;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class CollaborationController : DefaultApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ICourseCollaboratorRepository _collaborationRepository;
        private readonly IEntityModelMapper<CourseCollaborator> _collaboratorModelMapper;
        private readonly ICollaborationInviteMapper _inviteMapper;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly ICloner _cloner;

        public CollaborationController(IUserRepository userRepository, ICourseCollaboratorRepository collaborationRepository,
            IEntityModelMapper<CourseCollaborator> collaboratorModelMapper, IMailSenderWrapper mailSenderWrapper, ICloner cloner, ICollaborationInviteMapper inviteMapper)
        {
            _userRepository = userRepository;
            _collaborationRepository = collaborationRepository;
            _collaboratorModelMapper = collaboratorModelMapper;
            _mailSenderWrapper = mailSenderWrapper;
            _inviteMapper = inviteMapper;
            _cloner = cloner;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/collaborators")]
        public ActionResult GetCollaborators(Course course)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var collaborators = new List<object>();
            course.Collaborators.ForEach(e => collaborators.Add(_collaboratorModelMapper.Map(e)));

            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            if (owner != null)
            {
                collaborators.Add(new
                {
                    Email = owner.Email,
                    Registered = true,
                    FullName = owner.FullName,
                    CreatedOn = course.CreatedOn,
                    IsAccepted = true
                });
            }

            return JsonSuccess(collaborators);
        }

        [HttpPost]
        [EntityOwner(typeof(Course))]
        [Route("api/course/collaborator/add")]
        public ActionResult AddCollaborator(Course course, string collaboratorEmail)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }
            var colaboratorEmail = collaboratorEmail.Trim().ToLowerInvariant();
            var authorName = GetCurrentUsername();
            var collaborator = course.Collaborate(colaboratorEmail, authorName);
            if (collaborator == null)
            {
                return JsonSuccess(true);
            }

            var user = _userRepository.GetUserByEmail(colaboratorEmail);
            if (user == null)
            {
                var author = _userRepository.GetUserByEmail(authorName);

                _mailSenderWrapper.SendInviteCollaboratorMessage(colaboratorEmail, author.FullName, course.Title);
            }

            return JsonSuccess(_collaboratorModelMapper.Map(collaborator));
        }

        [HttpPost]
        [EntityOwner(typeof(Course))]
        [Route("api/course/collaborator/remove")]
        public ActionResult RemoveCollaborator(Course course, string collaboratorEmail)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var collaborator = course.Collaborators.FirstOrDefault(c => c.Email == collaboratorEmail);
            if (collaborator != null && collaborator.IsAdmin)
            {
                return ForbiddenResult();
            }

            if (!course.RemoveCollaborator(_cloner, collaboratorEmail))
            {
                return HttpNotFound(Errors.CollaboratorNotFoundError);
            }

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/collaboration/finish")]
        public ActionResult FinishCollaboration(Course course, string collaboratorEmail)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (collaboratorEmail != GetCurrentUsername())
            {
                return ForbiddenResult();
            }

            var collaborator = course.Collaborators.FirstOrDefault(c => c.Email == collaboratorEmail);
            if (collaborator != null && collaborator.IsAdmin)
            {
                return ForbiddenResult();
            }

            if (!course.RemoveCollaborator(_cloner, collaboratorEmail))
            {
                return HttpNotFound(Errors.CollaboratorNotFoundError);
            }

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/course/collaboration/invites")]
        public ActionResult GetCollaborationInvites()
        {
            var invites = _collaborationRepository.GetCollaborationInvites(GetCurrentUsername());
            return JsonSuccess(invites.Select(invite => _inviteMapper.Map(invite)));
        }

        [HttpPost]
        [Route("api/course/collaboration/invite/accept")]
        public ActionResult AcceptCollaborationInvite(Course course, CourseCollaborator collaborator)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (collaborator == null)
            {
                return HttpNotFound(Errors.CollaboratorNotFoundError);
            }

            if (collaborator.IsAdmin)
            {
                return ForbiddenResult();
            }

            course.AcceptCollaboration(collaborator);

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/course/collaboration/invite/decline")]
        public ActionResult DeclineCollaborationInvite(Course course, CourseCollaborator collaborator)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (collaborator == null)
            {
                return HttpNotFound(Errors.CollaboratorNotFoundError);
            }

            if (collaborator.IsAdmin)
            {
                return ForbiddenResult();
            }

            course.DeclineCollaboration(collaborator);

            return JsonSuccess();
        }
    }
}