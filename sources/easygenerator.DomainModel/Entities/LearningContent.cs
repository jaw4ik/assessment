using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class LearningContent : Entity
    {
        protected internal LearningContent() { }

        protected internal LearningContent(string text, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
        }

        public string Text { get; private set; }

        public virtual Question Question { get; internal set; }

        public virtual void UpdateText(string text, string modifiedBy)
        {
            ThrowIfTextIsInvalid(text);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Text = text;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentUpdatedEvent(this));
        }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
        }

    }
}
