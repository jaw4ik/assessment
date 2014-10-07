
using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Statement : Multipleselect
    {
        public Statement() { }

        public Statement(string title, string createdBy)
            : base(title, createdBy)
        {
            var correctAnswer = new Answer(Constants.Statement.DefaultStatementText, true, createdBy, DateTimeWrapper.Now());
            var incorrectAnswer = new Answer(Constants.Statement.DefaultStatementText, false, createdBy, DateTimeWrapper.Now().AddSeconds(1));

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
