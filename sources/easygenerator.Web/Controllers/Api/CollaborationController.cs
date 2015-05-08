using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Mail;
using System.Collections.Generic;
using System.Web.Mvc;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class CollaborationController : DefaultApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IEntityModelMapper<CourseCollaborator> _collaboratorEntityModelMapper;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly ICloner _cloner; 

        public CollaborationController(IUserRepository userRepository, IEntityModelMapper<CourseCollaborator> collaboratorEntityModelMapper, IMailSenderWrapper mailSenderWrapper, ICloner cloner)
        {
            _userRepository = userRepository;
            _collaboratorEntityModelMapper = collaboratorEntityModelMapper;
            _mailSenderWrapper = mailSenderWrapper;
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
            course.Collaborators.ForEach(e => collaborators.Add(_collaboratorEntityModelMapper.Map(e)));

            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            if (owner != null)
            {
                collaborators.Add(new
                {
                    Email = owner.Email,
                    Registered = true,
                    FullName = owner.FullName,
                    CreatedOn = course.CreatedOn
                });
            }

            return JsonSuccess(collaborators);
        }

        [HttpPost]
        [LimitCollaboratorsAmount]
        [EntityOwner(typeof(Course))]
        [Route("api/course/collaborator/add")]
        public ActionResult AddCollaborator(Course course, string email)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }
            var colaboratorEmail = email.Trim().ToLowerInvariant();
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

            return JsonSuccess(_collaboratorEntityModelMapper.Map(collaborator));
        }

        [HttpPost]
        [EntityOwner(typeof(Course))]
        [Route("api/course/collaborator/remove")]
        public ActionResult RemoveCollaborator(Course course, CourseCollaborator courseCollaborator)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (courseCollaborator == null)
            {
                return HttpNotFound(Errors.CollaboratorNotFoundError);
            }

            course.RemoveCollaborator(_cloner, courseCollaborator);

            return JsonSuccess();
        }
    }
}