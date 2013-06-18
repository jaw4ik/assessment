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

        //protected internal Entity(string createdBy)
        //    : this()
        //{
        //    ArgumentValidation.ThrowIfNullOrEmpty(createdBy, "createdBy");

        //    CreatedBy = createdBy;
        //    ModifiedBy = createdBy;
        //}

        public Guid Id { get; protected set; }
        public DateTime CreatedOn { get; protected set; }
        public DateTime ModifiedOn { get; protected set; }
        public string CreatedBy { get; protected set; }
        public string ModifiedBy { get; protected set; }

        //public virtual bool HasPermission(string username, AccessType accessType)
        //{
        //    return username == CreatedBy;
        //}

        //protected virtual void MarkAsModified(string modifiedBy)
        //{
        //    ModifiedBy = modifiedBy;
        //    ModifiedOn = DateTimeWrapper.Now();
        //}

        public override string ToString()
        {
            return String.Format("Id: {0}; CreatedBy: {1}; CreatedOn: {2}", Id, CreatedBy, CreatedOn);
        }
    }
}
