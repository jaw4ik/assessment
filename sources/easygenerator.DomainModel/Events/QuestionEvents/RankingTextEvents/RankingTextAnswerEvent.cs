using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents
{
    public abstract class RankingTextAnswerEvent : Event
    {
        public RankingTextAnswer Answer { get; private set; }

        protected RankingTextAnswerEvent(RankingTextAnswer answer)
        {
            ThrowIfAnswerIsInvalid(answer);

            Answer = answer;
        }

        private void ThrowIfAnswerIsInvalid(RankingTextAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
