using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public abstract class Entity
    {
        protected internal Entity()
        {
            Id = Guid.NewGuid();
            CreatedOn = DateTimeWrapper.Now();
            ModifiedOn = DateTimeWrapper.Now();
        }

        public Guid Id { get; protected set; }
        public DateTime CreatedOn { get; protected set; }
        public DateTime ModifiedOn { get; protected set; }

        protected virtual void MarkAsModified()
        {
            ModifiedOn = DateTimeWrapper.Now();
        }
    }
}
