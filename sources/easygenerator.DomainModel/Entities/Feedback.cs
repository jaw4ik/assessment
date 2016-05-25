using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities
{
    public class Feedback
    {
        public Feedback() { }

        public Feedback(string correctText, string incorrectText)
        {
            CorrectText = correctText;
            IncorrectText = incorrectText;
        }

        public string CorrectText { get; set; }

        public string IncorrectText { get; set; }
    }
}
