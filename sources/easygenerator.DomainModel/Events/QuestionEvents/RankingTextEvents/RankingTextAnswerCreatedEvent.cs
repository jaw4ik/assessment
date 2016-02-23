using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents
{
    public class RankingTextAnswerCreatedEvent : RankingTextAnswerEvent
    {
        public RankingTextAnswerCreatedEvent(RankingTextAnswer answer)
               : base(answer)
        {
        }
    }
}
