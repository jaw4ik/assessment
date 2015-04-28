using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public abstract class QuestionWithBackground : Question
    {
        protected internal QuestionWithBackground() { }

        protected internal QuestionWithBackground(string title, string createdBy)
            : base(title, createdBy)
        {
        }

        public string Background { get; private set; }

        public virtual void ChangeBackground(string background, string modifiedBy)
        {
            ThrowIfBackgroundIsInvalid(background);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Background = background;
            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionBackgroundChangedEvent(this, background));
        }

        private void ThrowIfBackgroundIsInvalid(string background)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(background, "background");
        }
    }
}
