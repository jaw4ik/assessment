using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ObjectiveObjectMother
    {
        private const string Title = "Objective title";

        public static Objective CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Objective Create(string title = Title)
        {
            return new Objective(title);
        }
    }
}
