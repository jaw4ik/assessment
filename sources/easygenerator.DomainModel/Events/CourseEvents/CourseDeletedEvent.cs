
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseDeletedEvent : CourseEvent
    {
        public IEnumerable<string> Collaborators { get; set; }
        public Dictionary<Guid, string> InvitedCollaborators { get; set; }
        public string DeletedBy { get; set; }

        public CourseDeletedEvent(Course course, List<string> collaborators, Dictionary<Guid, string> invitedCollaborators, string deletedBy)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(collaborators, "collaborators");
            ArgumentValidation.ThrowIfNull(invitedCollaborators, "invitedCollaborators");
            ArgumentValidation.ThrowIfNull(deletedBy, "deletedBy");

            Collaborators = collaborators;
            DeletedBy = deletedBy;
            InvitedCollaborators = invitedCollaborators;
        }
    }
}
