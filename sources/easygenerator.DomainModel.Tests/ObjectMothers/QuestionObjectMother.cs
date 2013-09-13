using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class QuestionObjectMother
    {
        private const string Title = "Question title";

        public static Question CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Question Create(string title = Title)
        {
            return new Question(title);
        }
    }
}
