using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.LearningContentEvents
{
    public class LearningContentUpdatedEvent : LearningContentEvent
    {
        public LearningContentUpdatedEvent(LearningContent learningContent)
            : base(learningContent)
        {
        }
    }
}
