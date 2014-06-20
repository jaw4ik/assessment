using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public interface IUsersCollaborationBroadcaster
    {
        dynamic AllUserCollaborators(string userEmail, ICollection<Course> sharedCourses);
    }

    public class UsersCollaborationBroadcaster : Broadcaster, IUsersCollaborationBroadcaster
    {
        public dynamic AllUserCollaborators(string userEmail, ICollection<Course> sharedCourses)
        {
            var collaborators = new List<string>();
            foreach (var course in sharedCourses)
            {
                var users = course.Collaborators.Select(c => c.Email).ToList();
                users.Add(course.CreatedBy);
                collaborators.AddRange(users);
            }

            collaborators.RemoveAll(item => item == userEmail);
            return Users(collaborators.Distinct());
        }
    }
}