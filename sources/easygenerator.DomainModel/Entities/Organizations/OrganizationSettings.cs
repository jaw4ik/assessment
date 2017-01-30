using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Entities.Organizations
{
    public class OrganizationSettings : EventRaiseable
    {
        public OrganizationSettings()
        {
            TemplateCollection = new Collection<Template>();
        }

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

            TemplateCollection = new Collection<Template>();
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

        public virtual void ResetSubscription()
        {
            if (!AccessType.HasValue && !ExpirationDate.HasValue)
                return;

            AccessType = null;
            ExpirationDate = null;

            RaiseEvent(new OrganizationSettingsSubscriptionResetEvent(Organization));
        }

        #endregion

        #region Templates

        protected internal virtual ICollection<Template> TemplateCollection { get; set; }
        public virtual IEnumerable<Template> Templates => TemplateCollection.AsEnumerable();

        public virtual void AddTemplate(Template template)
        {
            ThrowIfTemplateIsInvalid(template);

            if (TemplateCollection.Contains(template))
                return;

            TemplateCollection.Add(template);

            RaiseEvent(new OrganizationSettingsTemplateAddedEvent(Organization, template));
        }

        public virtual void RemoveTemplate(Template template)
        {
            ThrowIfTemplateIsInvalid(template);

            if (!TemplateCollection.Contains(template))
                return;

            TemplateCollection.Remove(template);
        }

        public virtual void ClearTemplates()
        {
            if (TemplateCollection.Count == 0)
                return;

            TemplateCollection.Clear();
        }

        #endregion

        #region Guard methods

        private static void ThrowIfOrganizationIsInvalid(Organization organization)
        {
            ArgumentValidation.ThrowIfNull(organization, nameof(organization));
        }

        private static void ThrowIfTemplateIsInvalid(Template template)
        {
            ArgumentValidation.ThrowIfNull(template, nameof(template));
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
