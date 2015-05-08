using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class BlankAnswerObjectMother
    {
        private const string Text = "Answer text";
        private const string CreatedBy = "username@easygenerator.com";

        public static BlankAnswer CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static BlankAnswer CreateWithCorrectness(bool isCorrect)
        {
            return Create(isCorrect: isCorrect);
        }

        public static BlankAnswer CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static BlankAnswer Create(string text = Text, bool isCorrect = true, Guid groupId = default(Guid), string createdBy = CreatedBy)
        {
            return new BlankAnswer(text, isCorrect, groupId, createdBy);
        }
    }
}
