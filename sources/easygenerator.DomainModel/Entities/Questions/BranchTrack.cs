using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class BranchTrack : Question
    {
        protected internal BranchTrack() { }
        protected internal BranchTrack(string title, string createdBy)
            : base(title, createdBy)
        {
        }
    }
}
