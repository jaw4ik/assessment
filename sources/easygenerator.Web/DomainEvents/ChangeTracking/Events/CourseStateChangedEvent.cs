using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.CourseEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class CourseStateChangedEvent: CourseEvent
    {
        public bool HasUnpublishedChanges { get; private set; }

        public CourseStateChangedEvent(Course course, bool hasUnpublishedChanges)
            : base(course)
        {
            HasUnpublishedChanges = hasUnpublishedChanges;
        }
    }
}