using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities
{
    public class DemoCourseInfo : Entity
    {
        public Course SourceCourse { get; protected internal set; }
        public Course DemoCourse { get; protected internal set; }

        protected internal DemoCourseInfo()
        {
        }

        protected internal DemoCourseInfo(Course sourceCourse, Course demoCourse, string createdBy)
            : base(createdBy)
        {
            ArgumentValidation.ThrowIfNull(demoCourse, "demoCourse");

            SourceCourse = sourceCourse;
            DemoCourse = demoCourse;
        }

        public void UpdateDemoCourse(Course demoCourse, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNull(demoCourse, "demoCourse");

            DemoCourse = demoCourse;
            MarkAsModified(modifiedBy);
        }
    }
}
