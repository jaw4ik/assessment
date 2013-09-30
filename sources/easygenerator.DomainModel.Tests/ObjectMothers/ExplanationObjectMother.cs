using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ExplanationObjectMother
    {
        private const string Text = "Explanation text";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Explanation CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Explanation Create(string text = Text, string createdby = CreatedBy)
        {
            return new Explanation(text, createdby);
        }
    }
}
