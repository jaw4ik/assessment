using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseState : Identifiable
    {
        public Guid Course_Id { get; set; }
        public virtual Course Course { get; private set; }
        public bool IsDirty { get; private set; }
        public bool IsDirtyForSale { get; private set; }

        protected internal CourseState() { }

        protected internal CourseState(Course course, bool isDirty, bool isDirtyForSale)
        {
            ArgumentValidation.ThrowIfNull(course, nameof(course));

            Course = course;
            IsDirty = isDirty;
            IsDirtyForSale = isDirtyForSale;
        }

        public void MarkAsDirty()
        {
            IsDirty = true;
            IsDirtyForSale = true;
        }

        public void MarkAsClean()
        {
            IsDirty = false;
        }

        public void MarkAsCleanForSale()
        {
            IsDirtyForSale = false;
        }
    }
}