using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents
{
    public class RankingTextAnswerDeletedEvent : RankingTextAnswerEvent
    {
        public Question Question { get; private set; }

        public RankingTextAnswerDeletedEvent(Question question, RankingTextAnswer answer)
               : base(answer)
        {
            ThrowIfQuestionIsInvalid(question);
            Question = question;
        }

        private void ThrowIfQuestionIsInvalid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }
    }
}
