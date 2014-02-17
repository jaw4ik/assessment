using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class TemplateObjectMother
    {
        private const string Name = "Default";
        private const string Image = "ImageUrl";
        private const string Description = "Description";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Template Create(string name = Name, string image = Image, string description = Description, string createdBy = CreatedBy)
        {
            return new Template(name, image, description, createdBy);
        }

        public static Template CreateWithImage(string image)
        {
            return Create(image: image);
        }

        public static Template CreateWithPreviewUrl(string previewUrl)
        {
            return new Template(Name, Image, Description, previewUrl, CreatedBy);
        }
    }
}
