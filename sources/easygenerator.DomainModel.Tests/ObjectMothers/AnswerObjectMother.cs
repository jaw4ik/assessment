using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class AnswerObjectMother
    {
        private const string Text = "Answer text";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Answer CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Answer CreateWithCorrectness(bool isCorrect)
        {
            return Create(isCorrect: isCorrect);
        }

        public static Answer Create(string text = Text, bool isCorrect = true, string createdBy = CreatedBy)
        {
            return new Answer(text, isCorrect, createdBy);
        }
    }
}
