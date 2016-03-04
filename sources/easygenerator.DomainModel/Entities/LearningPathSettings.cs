using System;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Entities
{
    public class LearningPathSettings : Entity
    {
        public LearningPathSettings()
        {

        }

        public LearningPathSettings(string createdBy)
        : base(createdBy)
        {

        }

        public virtual LearningPath LearningPath { get; set; }
        public string Data { get; set; }
    }
}
