using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.ObjectiveEvents
{
    public class ObjectiveTitleUpdatedEvent : ObjectiveEvent
    {
        public ObjectiveTitleUpdatedEvent(Objective objective) : base(objective)
        {
            
        }
    }
}
