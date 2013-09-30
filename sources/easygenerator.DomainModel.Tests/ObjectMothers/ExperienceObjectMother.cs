using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ExperienceObjectMother
    {
        private const string Title = "Experience title";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Experience CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Experience CreateWithTemplate(Template template, string title = Title, string createdBy = CreatedBy)
        {
            return new Experience(title, template, createdBy);
        }

        public static Experience Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Experience(title, TemplateObjectMother.Create(), createdBy);
        }
    }
}
