using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.LearningContentEvents
{
    public abstract class LearningContentEvent : Event
    {
        public LearningContent LearningContent { get; private set; }

        protected LearningContentEvent(LearningContent learningContent)
        {
            ThrowIfLearningContentIsInvalid(learningContent);
            LearningContent = learningContent;
        }

        private void ThrowIfLearningContentIsInvalid(LearningContent learningContent)
        {
            ArgumentValidation.ThrowIfNull(learningContent, "learningContent");
        }
    }
}
