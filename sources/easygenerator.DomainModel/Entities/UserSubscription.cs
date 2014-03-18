using System;
using System.Data.SqlTypes;

namespace easygenerator.DomainModel.Entities
{
    public class UserSubscription
    {
        protected internal UserSubscription() { }

        protected internal UserSubscription(AccessType accessType, DateTime? expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(accessType, expirationDate);

            Id = Guid.NewGuid();
            AccessType = accessType;
            ExpirationDate = expirationDate;
        }

        public Guid Id { get; protected internal set; }
        public AccessType AccessType { get; protected internal set; }
        public DateTime? ExpirationDate { get; protected internal set; }

        public User User { get; protected internal set; }

        public virtual void Downgrade()
        {
            AccessType = AccessType.Free;
            ExpirationDate = null;
        }

        public virtual void UpdatePlan(AccessType accessType, DateTime? expirationDate = null)
        {
            ThrowIfAccessTypeIsInvalid(accessType);
            ThrowIfExpirationDateIsInvalid(accessType, expirationDate);

            AccessType = accessType;
            ExpirationDate = expirationDate;
        }

        private void ThrowIfAccessTypeIsInvalid(AccessType accessType)
        {
            if (!Enum.IsDefined(typeof(AccessType), accessType))
                throw new ArgumentException("Access type is invalid", "accessType");
        }

        private void ThrowIfExpirationDateIsInvalid(AccessType accessType, DateTime? expirationDate)
        {
            if (accessType == AccessType.Free && expirationDate.HasValue)
            {
                throw new ArgumentException("Free access type subscription cannot have ExpirationDate", "expirationDate");
            }

            if (expirationDate.HasValue && expirationDate.Value < SqlDateTime.MinValue)
            {
                throw new ArgumentException("Expiration date is invalid", "expirationDate");
            }
        }
    }
}
