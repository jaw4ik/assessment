using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseAccessGrantedEvent : CourseEvent
    {
        public IEnumerable<string> UserIdentities { get; set; }
        public bool WithInvitation { get; set; }

        public CourseAccessGrantedEvent(Course course, IEnumerable<string> userIdentities, bool withInvitation)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(userIdentities, nameof(userIdentities));

            UserIdentities = userIdentities;
            WithInvitation = withInvitation;
        }
    }
}