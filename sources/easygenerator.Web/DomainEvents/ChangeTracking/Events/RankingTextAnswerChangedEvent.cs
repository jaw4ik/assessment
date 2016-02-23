using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class RankingTextAnswerChangedEvent : RankingTextAnswerEvent
    {
        public RankingTextAnswerChangedEvent(RankingTextAnswer answer)
            : base(answer)
        {

        }
    }
}