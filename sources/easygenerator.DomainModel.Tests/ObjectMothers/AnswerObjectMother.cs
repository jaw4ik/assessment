using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class AnswerObjectMother
    {
        private const string Text = "Answer text";

        public static Answer CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Answer CreateWithCorrectness(bool isCorrect)
        {
            return Create(isCorrect: isCorrect);
        }

        public static Answer Create(string text = Text, bool isCorrect = true)
        {
            return new Answer(text, isCorrect);
        }
    }
}
