using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents
{
    public abstract class DropspotEvent : Event
    {
        public Dropspot Dropspot { get; private set; }

        protected DropspotEvent(Dropspot dropspot)
        {
            ThrowIfDropspotIsInvalid(dropspot);

            Dropspot = dropspot;
        }

        private void ThrowIfDropspotIsInvalid(Dropspot dropspot)
        {
            ArgumentValidation.ThrowIfNull(dropspot, "dropspot");
        }
    }
}
