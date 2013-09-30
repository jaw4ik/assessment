﻿using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Answer : Entity
    {
        public Answer(string text, bool isCorrect, string createdBy) 
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
            IsCorrect = isCorrect;
        }

        public string Text { get; private set; }

        public void UpdateText(string text, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ThrowIfTextIsInvalid(text);
            Text = text;
            MarkAsModified(modifiedBy);
        }

        public bool IsCorrect { get; private set; }

        public void UpdateCorrectness(bool isCorrect, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            IsCorrect = isCorrect;
            MarkAsModified(modifiedBy);
        }

        public Question Question { get; internal set; }

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
