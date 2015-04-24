using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class TextMatchingAnswerObjectMother
    {
        private const string Key = "Key";
        private const string Value = "Value";
        private const string CreatedBy = "username@easygenerator.com";

        public static TextMatchingAnswer CreateWithKey(string key)
        {
            return Create(key: key);
        }

        public static TextMatchingAnswer CreateWithValue(string value)
        {
            return Create(value: value);
        }

        public static TextMatchingAnswer Create(string key = Key, string value = Value, string createdBy = CreatedBy)
        {
            return new TextMatchingAnswer(key, value, createdBy);
        }
    }
}
