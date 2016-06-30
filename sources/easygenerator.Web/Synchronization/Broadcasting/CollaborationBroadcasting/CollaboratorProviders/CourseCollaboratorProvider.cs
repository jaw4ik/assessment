using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public class CourseCollaboratorProvider : IEntityCollaboratorProvider<Course>
    {
        private readonly IOrganizationUserRepository _organizationUserRepository;

        public CourseCollaboratorProvider(IOrganizationUserRepository organizationUserRepository)
        {
            _organizationUserRepository = organizationUserRepository;
        }

        public IEnumerable<string> GetCollaborators(Course course)
        {
            var users = course.Collaborators.Where(c => c.IsAccepted).Select(c => c.Email).ToList();
            users.Add(course.CreatedBy);

            users.AddRange(_organizationUserRepository.GetUserOrganizationAdminEmails(course.CreatedBy));

            return users.Distinct();
        }

        public IEnumerable<string> GetUsersInvitedToCollaboration(Course course)
        {
            return course.Collaborators.Where(c => !c.IsAccepted).Select(c => c.Email).ToList();
        }
    }
}