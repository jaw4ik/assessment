using System;

namespace easygenerator.DomainModel.Entities
{
    public abstract class Identifiable : IIdentifiable
    {
        protected Identifiable()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; private set; }
    }
}
