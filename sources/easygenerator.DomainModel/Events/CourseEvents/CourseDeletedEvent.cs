
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseDeletedEvent : CourseEvent
    {
        public List<string> Collaborators { get; set; }
        public string DeletedBy { get; set; }

        public CourseDeletedEvent(Course course, List<string> collaborators, string deletedBy)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(collaborators, "collaborators");
            ArgumentValidation.ThrowIfNull(deletedBy, "deletedBy");

            Collaborators = collaborators;
            DeletedBy = deletedBy;
        }
    }
}
