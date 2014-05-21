
using System;

namespace easygenerator.DomainModel.Entities
{
    public class CourseCollabrator : Entity
    {
        public virtual Course Course { get; private set; }
        public virtual User User { get; private set; }

        protected internal CourseCollabrator(string createdBy)
            : base(createdBy)
        {
        }
    }
}
