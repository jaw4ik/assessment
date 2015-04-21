using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents
{
    public class HotSpotPolygonUpdatedEvent: HotSpotPolygonEvent
    {
        public HotSpotPolygonUpdatedEvent(HotSpotPolygon hotSpotPolygon)
            : base(hotSpotPolygon)
        {
        }
    }
}
