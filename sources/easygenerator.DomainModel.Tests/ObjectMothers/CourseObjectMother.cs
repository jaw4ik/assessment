using easygenerator.DomainModel.Entities;

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

        public static Course Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Course(title, TemplateObjectMother.Create(), createdBy);
        }
    }
}
