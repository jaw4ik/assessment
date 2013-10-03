using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class LearningObjectObjectMother
    {
        private const string Text = "LearningObject text";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static LearningObject CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static LearningObject Create(string text = Text, string createdby = CreatedBy)
        {
            return new LearningObject(text, createdby);
        }
    }
}
