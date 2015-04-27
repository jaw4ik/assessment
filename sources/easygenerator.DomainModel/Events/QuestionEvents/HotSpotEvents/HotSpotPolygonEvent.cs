using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents
{
    public abstract class HotSpotPolygonEvent : Event
    {
        public HotSpotPolygon HotSpotPolygon { get; private set; }

        protected HotSpotPolygonEvent(HotSpotPolygon hotSpotPolygon)
        {
            ThrowIfDropspotIsInvalid(hotSpotPolygon);

            HotSpotPolygon = hotSpotPolygon;
        }

        private void ThrowIfDropspotIsInvalid(HotSpotPolygon hotSpotPolygon)
        {
            ArgumentValidation.ThrowIfNull(hotSpotPolygon, "HotSpotPolygon");
        }
    }
}
