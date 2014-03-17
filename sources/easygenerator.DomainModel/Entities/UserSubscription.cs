using System;

namespace easygenerator.DomainModel.Entities
{
    public class UserSubscription
    {
        protected internal UserSubscription() { }

        protected internal UserSubscription(AccessType accessType, DateTime? expirationDate)
        {
            ThrowIfExpirationTimeIsInvalid(accessType, expirationDate);

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
            ThrowIfExpirationTimeIsInvalid(accessType, expirationDate);

            AccessType = accessType;
            ExpirationDate = expirationDate;
        }

        private void ThrowIfExpirationTimeIsInvalid(AccessType accessType, DateTime? expirationDate)
        {
            if (accessType == AccessType.Free && expirationDate.HasValue)
            {
                throw new ArgumentException("Free access type subscription cannot have ExpirationDate", "expirationDate");
            }
        }
    }
}
