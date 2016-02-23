using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class RankingTextObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";

        public static RankingText CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static RankingText CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static RankingText Create(string title = Title, string createdBy = CreatedBy)
        {
            return new RankingText(title, createdBy);
        }
    }
}
