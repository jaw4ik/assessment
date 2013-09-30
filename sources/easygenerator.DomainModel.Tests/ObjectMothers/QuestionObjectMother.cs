using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class QuestionObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Question CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Question Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Question(title, createdBy);
        }
    }
}
