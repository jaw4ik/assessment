using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class OpenQuestion : Question
    {
        protected internal OpenQuestion() { }

        protected internal OpenQuestion(string title, string createdBy)
            : base(title, createdBy)
        {
        }
    }
}
