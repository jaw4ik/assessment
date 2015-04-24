using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents
{
    public class HotSpotPolygonDeletedEvent: HotSpotPolygonEvent
    {
        public Question Question { get; private set; }

        public HotSpotPolygonDeletedEvent(Question question, HotSpotPolygon hotSpotPolygon)
            : base(hotSpotPolygon)
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
