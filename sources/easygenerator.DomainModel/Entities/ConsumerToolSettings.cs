using System;

namespace easygenerator.DomainModel.Entities
{
    public class ConsumerToolSettings
    {
        public Guid Id { get; private set; }

        public AccessType? AccessType { get; private set; }

        public int? ExpirationPeriod { get; private set; }

        public Company Company { get; private set; }

        public ConsumerTool ConsumerTool { get; private set; }
    }
}
