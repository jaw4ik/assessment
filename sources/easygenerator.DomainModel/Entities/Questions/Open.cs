using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Open : Question
    {
        protected internal Open() { }

        protected internal Open(string title, string createdBy)
            : base(title, createdBy)
        {
        }
    }
}
