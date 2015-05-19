using easygenerator.DomainModel.Entities;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public class CourseCollaboratorProvider : IEntityCollaboratorProvider<Course>
    {
        public IEnumerable<string> GetCollaborators(Course course)
        {
            var users = course.Collaborators.Where(c => c.IsAccepted).Select(c => c.Email).ToList();
            users.Add(course.CreatedBy);

            return users;
        }

        public IEnumerable<string> GetUsersInvitedToCollaboration(Course course)
        {
            var users = course.Collaborators.Where(c => !c.IsAccepted).Select(c => c.Email).ToList();
            users.Add(course.CreatedBy);

            return users;
        }
    }
}