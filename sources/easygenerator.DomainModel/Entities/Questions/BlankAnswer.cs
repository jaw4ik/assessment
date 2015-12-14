using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class BlankAnswer : Entity
    {
        protected internal BlankAnswer() { }

        protected internal BlankAnswer(string text, bool isCorrect, bool matchCase, Guid groupId, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
            IsCorrect = isCorrect;
            GroupId = groupId;
            MatchCase = matchCase;
            Order = 0;
        }

        public string Text { get; private set; }

        public bool IsCorrect { get; private set; }

        public bool MatchCase { get; private set; }

        public int Order { get; internal set; }

        public Guid GroupId { get; private set; }

        public virtual FillInTheBlanks Question { get; internal set; }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNull(text, "text");
        }

    }
}
