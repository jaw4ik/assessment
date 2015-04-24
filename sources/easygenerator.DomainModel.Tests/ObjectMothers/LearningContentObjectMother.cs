using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class LearningContentObjectMother
    {
        private const string Text = "LearningContent text";
        private const string CreatedBy = "useraname@easygenerator.com";

        public static LearningContent CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static LearningContent CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static LearningContent Create(string text = Text, string createdBy = CreatedBy)
        {
            return new LearningContent(text, createdBy);
        }
    }
}
