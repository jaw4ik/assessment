using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class SingleSelectImageAnswer : Entity
    {
        protected internal SingleSelectImageAnswer() { }

        protected internal SingleSelectImageAnswer(string createdBy, DateTime createdOn)
            : base(createdBy, createdOn)
        {
        }

        protected internal SingleSelectImageAnswer(string image, string createdBy)
            : base(createdBy)
        {
            ThrowIfImageIsInvalid(image);
            Image = image;
        }

        protected internal SingleSelectImageAnswer(string image, string createdBy, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            ThrowIfImageIsInvalid(image);
            Image = image;
        }

        public string Image { get; private set; }
        public virtual SingleSelectImage Question { get; internal set; }
        internal virtual bool IsCorrect { get; set; }

        public virtual void UpdateImage(string image, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ThrowIfImageIsInvalid(image);
            Image = image;
            MarkAsModified(modifiedBy);

            RaiseEvent(new SingleSelectImageAnswerImageUpdatedEvent(this));
        }

        private void ThrowIfImageIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNull(text, "text");
        }
    }
}
