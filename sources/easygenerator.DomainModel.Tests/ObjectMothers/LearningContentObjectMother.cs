using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class LearningContentObjectMother
    {
        private const string Text = "LearningContent text";
        private const string CreatedBy = "useraname@easygenerator.com";
        private const decimal Position = 1;

        public static LearningContent CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static LearningContent CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static LearningContent CreateWithPosition(decimal position)
        {
            return Create(position: position);
        }

        public static LearningContent Create(string text = Text, string createdBy = CreatedBy, decimal position = Position)
        {
            return new LearningContent(text, createdBy, position);
        }
    }
}
