using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class TemplateObjectMother
    {
        private const string Name = "Default";
        private const string Image = "imageUrl";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Template Create(string name = Name, string image = Image, string createdBy = CreatedBy)
        {
            return new Template(name, image, createdBy);
        }

        public static Template CreateWithImage(string image)
        {
            return Create(image: image);
        }
    }
}
