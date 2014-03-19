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
            ThrowIfSubscriptionPlanIsInvalid(accessType);
            ThrowIfExpirationDateIsInvalid(accessType, expirationDate);

            AccessType = accessType;
            ExpirationDate = expirationDate;
        }

        private void ThrowIfSubscriptionPlanIsInvalid(AccessType plan)
        {
            if (!Enum.IsDefined(typeof(AccessType), plan))
                throw new ArgumentException("Subscription plan is invalid", "plan");
        }

        private void ThrowIfExpirationDateIsInvalid(AccessType plan, DateTime? expirationDate)
        {
            if (plan == AccessType.Free && expirationDate.HasValue)
            {
                throw new ArgumentException("Free subscription plan cannot have ExpirationDate", "expirationDate");
            }

            if (expirationDate.HasValue && expirationDate.Value < SqlDateTime.MinValue.Value)
            {
                throw new ArgumentException("Expiration date is invalid", "expirationDate");
            }
        }
    }
}
