using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CommentEvents
{
    public class CommentDeletedEvent : CommentEvent
    {
        public Course Course { get; private set; }

        public CommentDeletedEvent(Course course, Comment comment)
            : base(comment)
        {
            ThrowIfCourseIsInvalid(course);
            Course = course;
        }

        private void ThrowIfCourseIsInvalid(Course course)
        {
            ArgumentValidation.ThrowIfNull(course, "course");
        }
    }
}
