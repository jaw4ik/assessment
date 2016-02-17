
using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Statement : Multipleselect
    {
        public Statement() { }

        public Statement(string title, string createdBy)
            : base(title, createdBy) { }

        public Statement(string title, string defaultStatementText, string createdBy)
            : base(title, createdBy)
        {
            var correctAnswer = new Answer(defaultStatementText, true, createdBy, DateTimeWrapper.Now());
            var incorrectAnswer = new Answer(defaultStatementText, false, createdBy, DateTimeWrapper.Now().AddSeconds(1));

            AnswersCollection.Add(correctAnswer);
            AnswersCollection.Add(incorrectAnswer);
        }

        public override void RemoveAnswer(Answer answer, string modifiedBy)
        {
            if (AnswersCollection.Count == 1)
            {
                throw new InvalidOperationException("Cannot remove the last statement");
            }

            base.RemoveAnswer(answer, modifiedBy);
        }
    }
}
