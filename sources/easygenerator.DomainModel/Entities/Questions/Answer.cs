using System;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Answer : Entity
    {
        protected internal Answer() { }

        protected internal Answer(string text, bool isCorrect, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            CreateAnswer(text, isCorrect);
        }

        protected internal Answer(string text, bool isCorrect, string createdBy, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            ThrowIfTextIsInvalid(text);

            CreateAnswer(text, isCorrect);
        }

        private void CreateAnswer(string text, bool isCorrect)
        {
            Text = text;
            IsCorrect = isCorrect;
        }

        public string Text { get; private set; }

        public virtual void UpdateText(string text, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ThrowIfTextIsInvalid(text);
            Text = text;
            MarkAsModified(modifiedBy);

            RaiseEvent(new AnswerTextUpdatedEvent(this));
        }

        public bool IsCorrect { get; private set; }

        public virtual void UpdateCorrectness(bool isCorrect, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            IsCorrect = isCorrect;
            MarkAsModified(modifiedBy);

            RaiseEvent(new AnswerCorrectnessUpdatedEvent(this));
        }

        public virtual Multipleselect Question { get; internal set; }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNull(text, "text");
        }

        
    }
}
