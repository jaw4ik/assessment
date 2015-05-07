using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class MultipleselectObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static Multipleselect CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Multipleselect CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Multipleselect Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Multipleselect(title, createdBy);
        }
    }
}
