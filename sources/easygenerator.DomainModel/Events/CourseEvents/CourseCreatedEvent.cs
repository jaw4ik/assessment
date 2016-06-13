
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseCreatedEvent : CourseEvent
    {
        public string CreatedBy { get; set; }

        public CourseCreatedEvent(Course course, string createdBy)
            : base(course)
        {
            ArgumentValidation.ThrowIfNull(createdBy, nameof(createdBy));

            CreatedBy = createdBy;
        }
    }
}
