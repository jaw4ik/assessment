using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class LearningObjectObjectMother
    {
        private const string Text = "LearningObject text";
        private const string CreatedBy = "useraname@easygenerator.com";

        public static LearningObject CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static LearningObject CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static LearningObject Create(string text = Text, string createdBy = CreatedBy)
        {
            return new LearningObject(text, createdBy);
        }
    }
}
