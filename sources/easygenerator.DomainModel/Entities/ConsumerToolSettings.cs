using System;

namespace easygenerator.DomainModel.Entities
{
    public class ConsumerToolSettings
    {
        public Guid Id { get; private set; }

        public virtual AccessType? AccessType { get; private set; }

        public virtual int? ExpirationPeriodDays { get; private set; }

        public virtual Company Company { get; private set; }

        public ConsumerTool ConsumerTool { get; private set; }
    }
}
