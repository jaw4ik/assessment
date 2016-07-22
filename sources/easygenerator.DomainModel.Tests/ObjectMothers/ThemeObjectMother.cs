using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ThemeObjectMother
    {
        private const string Name = "Theme name";
        private const string Settings = "{}";
        private const string CreatedBy = "username@easygenerator.com";

        public static Theme CreateWithTemplate(Template template)
        {
            return Create(template);
        }

        public static Theme CreateWithName(string name)
        {
            return Create(TemplateObjectMother.Create(), name);
        }

        public static Theme CreateWithSettings(string settings)
        {
            return Create(TemplateObjectMother.Create(), settings: settings);
        }

        public static Theme CreateWithCreatedBy(string createdBy)
        {
            return Create(TemplateObjectMother.Create(), createdBy: createdBy);
        }

        public static Theme Create()
        {
            return Create(TemplateObjectMother.Create());
        }

        public static Theme Create(Template template, string name = Name, string settings = Settings, string createdBy = CreatedBy)
        {
            return new Theme(template, name, settings, createdBy);
        }
    }
}
