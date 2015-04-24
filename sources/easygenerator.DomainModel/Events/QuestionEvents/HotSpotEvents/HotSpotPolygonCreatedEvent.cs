using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents
{
    public class HotSpotPolygonCreatedEvent : HotSpotPolygonEvent
    {
        public HotSpotPolygonCreatedEvent(HotSpotPolygon hotSpotPolygon)
            : base(hotSpotPolygon)
        {
        }
    }
}
