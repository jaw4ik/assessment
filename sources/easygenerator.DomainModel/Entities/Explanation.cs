using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Explanation : Entity
    {
        public Explanation(string text)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
        }

        public string Text { get; private set; }

        public Question Question { get; internal set; }

        public void UpdateText(string text)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
            MarkAsModified();
        }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
            ArgumentValidation.ThrowIfLongerThan255(text, "text");
        }

    }
}
