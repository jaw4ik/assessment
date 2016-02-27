using System;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class RankingTextAnswerObjectMother
    {
        private const string Text = "Answer text";
        private const string CreatedBy = "username@easygenerator.com";

        public static RankingTextAnswer CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static RankingTextAnswer CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static RankingTextAnswer Create(string text = Text, string createdBy = CreatedBy)
        {
            return new RankingTextAnswer(text, createdBy);
        }
    }
}
