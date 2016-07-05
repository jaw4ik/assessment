using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.CourseEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class CourseStateChangedEvent : CourseEvent
    {
        public bool IsDirty { get; private set; }
        public bool IsDirtyForSale { get; private set; }

        public CourseStateChangedEvent(Course course, bool isDirty, bool isDirtyForSale)
            : base(course)
        {
            IsDirty = isDirty;
            IsDirtyForSale = isDirtyForSale;
        }
    }
}