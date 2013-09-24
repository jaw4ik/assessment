using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Answer : Entity
    {
        public Answer(string text, bool isCorrect)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
            IsCorrect = isCorrect;
        }

        public string Text { get; private set; }

        public void UpdateText(string text)
        {
            ThrowIfTextIsInvalid(text);
            Text = text;
            MarkAsModified();
        }

        public bool IsCorrect { get; private set; }

        public void UpdateCorrectness(bool isCorrect)
        {
            IsCorrect = isCorrect;
            MarkAsModified();
        }

        public Question Question { get; internal set; }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
            ArgumentValidation.ThrowIfLongerThan255(text, "text");
        }
    }
}
