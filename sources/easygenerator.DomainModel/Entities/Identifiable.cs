using System;

namespace easygenerator.DomainModel.Entities
{
    public abstract class Identifiable : IIdentifiable
    {
        protected Identifiable()
        {
            Id = Guid.NewGuid();
        }

        protected Identifiable(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; private set; }
    }
}
