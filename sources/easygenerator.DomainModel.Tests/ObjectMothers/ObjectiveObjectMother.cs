using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    class ObjectiveObjectMother
    {
        private const string Title = "Objective title";
        private const string CreatedBy = "Username";

        public static Objective CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Objective CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Objective Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Objective(title, createdBy);
        }
    }
}
