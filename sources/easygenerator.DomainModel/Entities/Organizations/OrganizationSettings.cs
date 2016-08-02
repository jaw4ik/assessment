using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities.Organizations
{
    public class OrganizationSettings : EventRaiseable
    {
        public OrganizationSettings() { }

        public OrganizationSettings(Organization organization, AccessType? accessType = null, DateTime? expirationDate = null)
        {
            ThrowIfOrganizationIsInvalid(organization);
            Organization = organization;

            if (accessType.HasValue || expirationDate.HasValue)
            {
                ThrowIfAccessTypeIsInvalid(accessType);
                ThrowIfExpirationDateIsInvalid(expirationDate);

                AccessType = accessType;
                ExpirationDate = expirationDate;
            }
        }

        public virtual Organization Organization { get; protected internal set; }

        #region Subscription

        public AccessType? AccessType { get; protected internal set; }
        public DateTime? ExpirationDate { get; protected internal set; }

        public virtual UserSubscription GetSubscription()
        {
            return AccessType.HasValue && ExpirationDate.HasValue
               ? new UserSubscription(AccessType.Value, ExpirationDate.Value)
               : null;
        }

        public virtual void UpdateSubscription(AccessType accessType, DateTime expirationDate)
        {
            ThrowIfAccessTypeIsInvalid(accessType);
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = accessType;
            ExpirationDate = expirationDate;

            RaiseEvent(new OrganizationSettingsSubscriptionUpdatedEvent(Organization));
        }

        #endregion

        #region Guard methods

        private static void ThrowIfOrganizationIsInvalid(Organization organization)
        {
            ArgumentValidation.ThrowIfNull(organization, nameof(organization));
        }

        private static void ThrowIfAccessTypeIsInvalid(AccessType? accessType)
        {
            if (!accessType.HasValue)
                throw new ArgumentException("Access type is required.", nameof(accessType));
        }

        private static void ThrowIfExpirationDateIsInvalid(DateTime? expirationDate)
        {
            if (!expirationDate.HasValue)
                throw new ArgumentException("Expiration date is required.", nameof(expirationDate));

            ThrowIfExpirationDateIsInvalid(expirationDate.Value);
        }

        private static void ThrowIfExpirationDateIsInvalid(DateTime expirationDate)
        {
            ArgumentValidation.ThrowIfDateIsInvalid(expirationDate, nameof(expirationDate));
        }

        #endregion
    }
}
