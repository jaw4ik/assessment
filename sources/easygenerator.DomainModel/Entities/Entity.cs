using System;
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

        protected internal Entity(string createdBy)
            : this()
        {
            ThrowIfCreatedByIsInvalid(createdBy);

            CreatedBy = createdBy;
            ModifiedBy = createdBy;
        }

        public Guid Id { get; protected set; }
        public string CreatedBy { get; protected set; }
        public DateTime CreatedOn { get; protected set; }
        public string ModifiedBy { get; protected set; }
        public DateTime ModifiedOn { get; protected set; }

        protected internal virtual void DefineCreatedBy(string createdBy)
        {
            ThrowIfCreatedByIsInvalid(createdBy);

            CreatedBy = createdBy;
            ModifiedBy = createdBy;
        }

        internal virtual void MarkAsModified(string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ModifiedBy = modifiedBy;
            ModifiedOn = DateTimeWrapper.Now();
        }

        private void ThrowIfCreatedByIsInvalid(string createdBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(createdBy, "createdBy");
        }

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
