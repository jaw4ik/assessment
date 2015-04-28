using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
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

            CreateAnswer(key, value);
        }

        protected internal TextMatchingAnswer(string key, string value, string createdBy, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            ThrowIfKeyIsInvalid(key);
            ThrowIfValueIsInvalid(value);

            CreateAnswer(key, value);
        }

        private void CreateAnswer(string key, string value)
        {
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

            RaiseEvent(new TextMatchingAnswerKeyChangedEvent(this));
        }

        public virtual void ChangeValue(string value, string modifiedBy)
        {
            ThrowIfValueIsInvalid(value);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Value = value;

            MarkAsModified(modifiedBy);

            RaiseEvent(new TextMatchingAnswerValueChangedEvent(this));
        }

        private void ThrowIfValueIsInvalid(string value)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(value, "value");
            ArgumentValidation.ThrowIfLongerThan255(value, "value");
        }

        private void ThrowIfKeyIsInvalid(string key)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(key, "key");
            ArgumentValidation.ThrowIfLongerThan255(key, "key");
        }
    }
}
