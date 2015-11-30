using System;
using easygenerator.StorageServer.Infrastructure;

namespace easygenerator.StorageServer.Models.Entities
{
    public abstract class Entity
    {
        protected Entity()
        {
            Id = Guid.NewGuid();
            CreatedOn = DateTime.UtcNow;
            ModifiedOn = DateTime.UtcNow;
        }

        public Guid Id { get; private set; }
        public DateTime CreatedOn { get; protected internal set; }
        public DateTime ModifiedOn { get; protected internal set; }

    }
}