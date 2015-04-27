using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.LearningContentEvents;

namespace easygenerator.DomainModel.Events.LearningContentEvents
{
    public class LearningContentCreatedEvent : LearningContentEvent
    {
        public LearningContentCreatedEvent(LearningContent learningContent)
            : base(learningContent)
        {
        }
    }
}
