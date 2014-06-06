using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting
{
    public class CourseCollaborationBroadcaster : Broadcaster, ICourseCollaborationBroadcaster
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

            return Users(GetCourseCollaborators(course));
        }

        public dynamic AllCollaboratorsExcept(Course course, params string[] excludeUsers)
        {
            ThrowIfCourseNotValid(course);

            return Users(GetCollaboratorsExcept(course, new List<string>(excludeUsers)));
        }

        public dynamic AllCollaboratorsExcept(Course course, List<string> excludeUsers)
        {
            ThrowIfCourseNotValid(course);

            return Users(GetCollaboratorsExcept(course, excludeUsers));
        }

        public dynamic OtherCollaborators(Course course)
        {
            ThrowIfCourseNotValid(course);

            return Users(GetCollaboratorsExcept(course, new List<string>() { CurrentUsername }));
        }

        private List<string> GetCollaboratorsExcept(Course course, List<string> excludeUsers)
        {
            var users = GetCourseCollaborators(course);
            users.RemoveAll(u => excludeUsers.Exists(e => u == e));

            return users;
        }

        private List<string> GetCourseCollaborators(Course course)
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