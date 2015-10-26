using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class ScenarioObjectMother
    {
        private const string Title = "Question title";
        private const int MasteryScore = 100;
        private const string CreatedBy = "username@easygenerator.com";

        public static Scenario CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Scenario CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Scenario Create(string title = Title, int masteryScore = MasteryScore, string createdBy = CreatedBy)
        {
            return new Scenario(title, masteryScore, createdBy);
        }
    }
}
