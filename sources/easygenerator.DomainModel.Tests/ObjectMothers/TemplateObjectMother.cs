using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class TemplateObjectMother
    {
        private const string Name = "Default";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Template Create(string name = Name, string createdBy = CreatedBy)
        {
            return new Template(name, createdBy);
        }

        public static Template CreateWithPreviewUrl(string previewUrl)
        {
            return new Template(Name, previewUrl, CreatedBy);
        }
    }
}
