using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class SectionObjectMother
    {
        private const string Title = "Section title";
        private const string CreatedBy = "username@easygenerator.com";

        public static Section CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Section CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Section Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Section(title, createdBy);
        }
    }
}
