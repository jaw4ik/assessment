using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents
{
    public class DropspotTextChangedEvent: DropspotEvent
    {
        public DropspotTextChangedEvent(Dropspot dropspot)
            : base(dropspot)
        {
        }
    }
}
