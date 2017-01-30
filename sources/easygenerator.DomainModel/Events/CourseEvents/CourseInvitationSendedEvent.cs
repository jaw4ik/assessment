using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseInvitationSendedEvent : CourseEvent
    {
        public string UserIdentity { get; set; }

        public User InvitedBy { get; set; }

        public CourseInvitationSendedEvent(Course course, string userIdentity, User invitedBy)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(userIdentity, nameof(userIdentity));

            UserIdentity = userIdentity;
            InvitedBy = invitedBy;
        }
    }
}