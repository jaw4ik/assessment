using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseAccessRemovedEvent : CourseEvent
    {
        public string UserIdentity { get; set; }

        public CourseAccessRemovedEvent(Course course, string userIdentity)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(userIdentity, nameof(userIdentity));

            UserIdentity = userIdentity;
        }
    }
}