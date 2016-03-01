using System.Collections.Generic;
using easygenerator.DomainModel.Events;
using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities
{
    public abstract class Entity : Identifiable
    {
        private readonly Queue<Event> _events;

        protected internal Entity()
            : base()
        {
            CreatedOn = DateTimeWrapper.Now();
            ModifiedOn = DateTimeWrapper.Now();

            _events = new Queue<Event>();
        }

        protected internal Entity(string createdBy)
            : this()
        {
            ThrowIfCreatedByIsInvalid(createdBy);

            CreatedBy = createdBy;
            ModifiedBy = createdBy;
        }

        protected internal Entity(string createdBy, DateTime createdOn)
            : this(createdBy)
        {
            ThrowIfCreatedByIsInvalid(createdBy);

            CreatedOn = createdOn;
            ModifiedOn = createdOn;
        }

        public string CreatedBy { get; protected set; }
        public DateTime CreatedOn { get; protected internal set; }
        public string ModifiedBy { get; protected set; }
        public DateTime ModifiedOn { get; protected internal set; }

        protected void RaiseEvent(Event @event)
        {
            _events.Enqueue(@event);
        }

        internal Event DequeueEvent()
        {
            return _events.Count > 0 ? _events.Dequeue() : null;
        }

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

        protected void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }

        protected void ThrowIfCreatedByIsInvalid(string createdBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(createdBy, "createdBy");
        }


    }
}
