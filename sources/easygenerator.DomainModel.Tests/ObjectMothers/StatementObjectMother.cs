using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class StatementObjectMother
    {
        private const string Title = "Question title";
        private const string DefaultStatementText = "Statement";
        private const string CreatedBy = "username@easygenerator.com";

        public static Statement CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Statement CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Statement Create(string title = Title, string defaultStatementText = DefaultStatementText, string createdBy = CreatedBy)
        {
            return new Statement(title, defaultStatementText, createdBy);
        }
    }
}
