using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class HotSpotObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static HotSpot CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static HotSpot CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static HotSpot Create(string title = Title, string createdBy = CreatedBy)
        {
            return new HotSpot(title, createdBy);
        }
    }
}
