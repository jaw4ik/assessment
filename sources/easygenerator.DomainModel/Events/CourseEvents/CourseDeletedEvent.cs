
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseDeletedEvent : CourseEvent
    {
        public IEnumerable<string> DeletedSectionIds { get; set; }
        public string DeletedBy { get; set; }

        public CourseDeletedEvent(Course course, List<string> deletedSectionIds, string deletedBy)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(deletedSectionIds, "deletedSectionIds");
            ArgumentValidation.ThrowIfNull(deletedBy, "deletedBy");

            DeletedSectionIds = deletedSectionIds;
            DeletedBy = deletedBy;
        }
    }
}