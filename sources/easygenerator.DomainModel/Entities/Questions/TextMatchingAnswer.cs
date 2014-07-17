using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class TextMatchingAnswer : Entity
    {
        public string Key { get; private set; }
        public string Value { get; private set; }

        protected internal TextMatchingAnswer() { }

        public TextMatchingAnswer(string key, string value, string createdBy)
            : base(createdBy)
        {
            ThrowIfKeyIsInvalid(key);
            ThrowIfValueIsInvalid(value);

            Key = key;
            Value = value;
        }

        public virtual TextMatching Question { get; internal set; }

        public virtual void ChangeKey(string key, string modifiedBy)
        {
            ThrowIfKeyIsInvalid(key);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Key = key;

            MarkAsModified(modifiedBy);
        }

        public virtual void ChangeValue(string value, string modifiedBy)
        {
            ThrowIfValueIsInvalid(value);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Value = value;

            MarkAsModified(modifiedBy);
        }

        private void ThrowIfValueIsInvalid(string value)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(value, "value");
        }

        private void ThrowIfKeyIsInvalid(string key)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(key, "key");
        }
    }
}
