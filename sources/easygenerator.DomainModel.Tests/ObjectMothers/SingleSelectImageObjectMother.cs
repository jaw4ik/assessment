
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class SingleSelectImageObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static SingleSelectImage CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static SingleSelectImage CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static SingleSelectImage Create(string title = Title, string createdBy = CreatedBy)
        {
            return new SingleSelectImage(title, createdBy);
        }
    }
}
