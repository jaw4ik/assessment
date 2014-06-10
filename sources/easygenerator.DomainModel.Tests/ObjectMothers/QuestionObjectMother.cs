using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class QuestionObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static Question CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Question CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Question Create(string title = Title, QuestionType type = QuestionType.MultipleSelect, string createdBy = CreatedBy)
        {
            return new Question(title, type, createdBy);
        }
    }
}
