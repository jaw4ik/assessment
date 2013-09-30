using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Explanation : Entity
    {
        public Explanation(string text, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
        }

        public string Text { get; private set; }

        public Question Question { get; internal set; }

        public void UpdateText(string text, string modifiedBy)
        {
            ThrowIfTextIsInvalid(text);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Text = text;
            MarkAsModified(modifiedBy);
        }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
            ArgumentValidation.ThrowIfLongerThan255(text, "text");
        }

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
