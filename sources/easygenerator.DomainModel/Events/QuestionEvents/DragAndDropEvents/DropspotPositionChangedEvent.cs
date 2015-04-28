using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents
{
    public class DropspotPositionChangedEvent: DropspotEvent
    {
        public DropspotPositionChangedEvent(Dropspot dropspot)
            : base(dropspot)
        {
        }
    }
}
