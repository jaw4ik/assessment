using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseObjectMother
    {
        private const string Title = "Course title";
        private const string CreatedBy = "username@easygenerator.com";

        public static Course CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Course CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Course CreateWithTemplate(Template template, string title = Title, string createdBy = CreatedBy)
        {
            return new Course(title, template, createdBy);
        }

        public static Course CreateWithAim4YouIntegration(Guid? aim4YouCourseId = null)
        {
            Guid aim4YouIntegrationId = aim4YouCourseId.HasValue ? aim4YouCourseId.Value : Guid.NewGuid();
            var course = new Course(Title, TemplateObjectMother.Create(), CreatedBy);
            course.RegisterOnAim4YOu(aim4YouIntegrationId);
            return course;
        }

        public static Course CreateWithComments(IEnumerable<Comment> comments)
        {
            var course = Create();
            foreach (var comment in comments)
            {
                course.AddComment(comment);
            }
            return course;
        }

        public static Course Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Course(title, TemplateObjectMother.Create(), createdBy);
        }
    }
}
