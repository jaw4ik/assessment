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

        public string GeneralText { get; set; }

        public string CorrectText { get; set; }

        public string IncorrectText { get; set; }
    }
}
