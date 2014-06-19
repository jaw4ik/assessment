using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class CourseCollaborationBroadcaster : Broadcaster, ICollaborationBroadcaster<Course>
    {
        public CourseCollaborationBroadcaster(IHubContext hubContext)
            : base(hubContext)
        {
        }

        public CourseCollaborationBroadcaster()
        {
            
        }

        public dynamic AllCollaborators(Course course)
        {
            ThrowIfCourseNotValid(course);

            return Users(GetCollaborators(course));
        }

        public dynamic AllCollaboratorsExcept(Course course, params string[] excludeUsers)
        {
            ThrowIfCourseNotValid(course);

            return Users(GetCollaboratorsExcept(course, new List<string>(excludeUsers)));
        }

        public dynamic OtherCollaborators(Course course)
        {
            ThrowIfCourseNotValid(course);

            return Users(GetCollaboratorsExcept(course, new List<string>() { CurrentUsername }));
        }

        public IEnumerable<string> GetCollaboratorsExcept(Course course, List<string> excludeUsers)
        {
            var users = GetCollaborators(course).ToList();
            users.RemoveAll(u => excludeUsers.Exists(e => u == e));

            return users;
        }

        public IEnumerable<string> GetCollaborators(Course course)
        {
            var users = course.Collaborators.Select(c => c.Email).ToList();
            users.Add(course.CreatedBy);

            return users;
        }

        private void ThrowIfCourseNotValid(Course course)
        {
            ArgumentValidation.ThrowIfNull(course, "course");
        }
    }
}