using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public abstract class CollaborationEvent : CourseEvent
    {
        public CourseCollaborator Collaborator { get; private set; }

        protected CollaborationEvent(Course course, CourseCollaborator collaborator)
            : base(course)
        {
            ThrowIfCourseCollabratorIsInvalid(collaborator);
            Collaborator = collaborator;
        }

        private void ThrowIfCourseCollabratorIsInvalid(CourseCollaborator courseCollaborator)
        {
            ArgumentValidation.ThrowIfNull(courseCollaborator, "courseCollabrator");
        }
    }
}
