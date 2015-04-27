using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class SingleSelectImageAnswerObjectMother
    {
        private const string Image = "Image";
        private const string CreatedBy = "username@easygenerator.com";

        public static SingleSelectImageAnswer CreateWithImage(string image)
        {
            return Create(image: image);
        }

        public static SingleSelectImageAnswer CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static SingleSelectImageAnswer Create(string image = Image, string createdBy = CreatedBy)
        {
            return new SingleSelectImageAnswer(image, createdBy);
        }
    }
}
