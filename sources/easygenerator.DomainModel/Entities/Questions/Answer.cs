using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Answer : Entity
    {
        protected internal Answer() { }

        protected internal Answer(string text, bool isCorrect, Guid group, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            CreateAnswer(text, isCorrect, group);
        }

        protected internal Answer(string text, bool isCorrect, Guid group, string createdBy, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            ThrowIfTextIsInvalid(text);

            CreateAnswer(text, isCorrect, group);
        }

        private void CreateAnswer(string text, bool isCorrect, Guid group)
        {
            Text = text;
            IsCorrect = isCorrect;
            Group = group;
        }

        public string Text { get; private set; }

        public virtual void UpdateText(string text, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ThrowIfTextIsInvalid(text);
            Text = text;
            MarkAsModified(modifiedBy);
        }

        public bool IsCorrect { get; private set; }

        public virtual void UpdateCorrectness(bool isCorrect, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            IsCorrect = isCorrect;
            MarkAsModified(modifiedBy);
        }

        public Guid Group { get; private set; }

        public virtual Multipleselect Question { get; internal set; }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNull(text, "text");
        }

        
    }
}
