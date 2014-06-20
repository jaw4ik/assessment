using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CollaborationEvents
{
    public class CollaboratorRegisteredEvent
    {
        public User User { get; private set; }
        public ICollection<Course> SharedCourses { get; private set; }

        public CollaboratorRegisteredEvent(User user, ICollection<Course> sharedCourses)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
            ArgumentValidation.ThrowIfNull(sharedCourses, "sharedCourses");

            User = user;
            SharedCourses = sharedCourses;
        }
    }
}
