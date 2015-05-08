using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class HotSpotPolygonChangedEvent : HotSpotPolygonEvent
    {
        public HotSpotPolygonChangedEvent(HotSpotPolygon polygon)
            : base(polygon)
        {

        }
    }
}