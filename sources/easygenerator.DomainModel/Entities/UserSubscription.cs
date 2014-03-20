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

        public virtual void UpgradeToStarter(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.Starter;
            ExpirationDate = expirationDate;
        }

        private void ThrowIfExpirationDateIsInvalid(AccessType plan, DateTime? expirationDate)
        {
            if (plan == AccessType.Free && expirationDate.HasValue)
            {
                throw new ArgumentException("Free subscription plan cannot have expiration date", "expirationDate");
            }

            ThrowIfExpirationDateIsInvalid(expirationDate);
        }

        private void ThrowIfExpirationDateIsInvalid(DateTime? expirationDate)
        {
            if (expirationDate.HasValue && expirationDate < SqlDateTime.MinValue.Value)
            {
                throw new ArgumentException("Expiration date is invalid", "expirationDate");
            }
        }
    }
}
