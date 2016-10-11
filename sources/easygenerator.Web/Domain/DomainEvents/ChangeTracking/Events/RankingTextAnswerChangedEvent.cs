using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class RankingTextAnswerChangedEvent : RankingTextAnswerEvent
    {
        public RankingTextAnswerChangedEvent(RankingTextAnswer answer)
            : base(answer)
        {

        }
    }
}