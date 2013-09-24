using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ExplanationObjectMother
    {
        private const string Text = "Explanation text";

        public static Explanation CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Explanation Create(string text = Text)
        {
            return new Explanation(text);
        }
    }
}
