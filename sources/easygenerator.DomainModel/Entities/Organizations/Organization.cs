using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text.RegularExpressions;

namespace easygenerator.DomainModel.Entities.Organizations
{
    public class Organization : Entity
    {
        protected internal Organization()
        {
            UserCollection = new Collection<OrganizationUser>();
        }

        protected internal Organization(string title, string createdBy, string emailDomains = null, OrganizationSettings settings = null)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            if (emailDomains != null)
            {
                ThrowIfEmailDomainIsInvalid(emailDomains);
                EmailDomains = emailDomains;
            }

            Title = title;
            Settings = settings;
            UserCollection = new Collection<OrganizationUser>();
            UserCollection.Add(new OrganizationUser(this, createdBy, true, OrganizationUserStatus.Accepted, createdBy));
        }

        #region Title

        public string Title { get; protected internal set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);

            RaiseEvent(new OrganizationTitleUpdatedEvent(this));
        }

        #endregion

        #region Users   

        protected internal virtual ICollection<OrganizationUser> UserCollection { get; set; }
        public virtual IEnumerable<OrganizationUser> Users => UserCollection.AsEnumerable();

        public virtual OrganizationUser AddUser(string email, string createdBy, OrganizationUserStatus status = OrganizationUserStatus.WaitingForAcceptance)
        {
            ThrowIfUserEmailIsInvalid(email);
            if (Users.Any(e => e.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase)))
                return null;

            var organizationUser = new OrganizationUser(this, email, false, status, createdBy);
            UserCollection.Add(organizationUser);

            MarkAsModified(createdBy);
            RaiseEvent(new OrganizationUserAddedEvent(this, organizationUser));

            return organizationUser;
        }

        public virtual bool RemoveUser(OrganizationUser organizationUser, string modifiedBy)
        {
            organizationUser.Organization = null;
            UserCollection.Remove(organizationUser);

            MarkAsModified(modifiedBy);
            RaiseEvent(new OrganizationUserRemovedEvent(this, organizationUser));

            return true;
        }

        #endregion

        #region Settings

        public virtual OrganizationSettings Settings { get; protected internal set; }

        public virtual OrganizationSettings GetOrCreateSettings()
        {
            return Settings ?? (Settings = new OrganizationSettings(this));
        }

        public virtual void ResetSettings()
        {
            if (Settings == null)
                return;

            Settings = null;
            RaiseEvent(new OrganizationSettingsResetEvent(this));
        }

        #endregion

        #region Email domains

        public string EmailDomains { get; protected internal set; }

        public virtual IEnumerable<string> EmailDomainCollection
        {
            get
            {
                return string.IsNullOrEmpty(EmailDomains) ? new List<string>() : EmailDomains.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)
                  .Select(domain => domain.Trim()).ToList();
            }
        }

        public virtual void UpdateEmailDomains(string emailDomains)
        {
            ThrowIfEmailDomainIsInvalid(emailDomains);

            EmailDomains = emailDomains.Replace(" ", string.Empty);

            RaiseEvent(new OrganizationEmailDomainUpdatedEvent(this));
        }

        public virtual void ClearEmailDomains()
        {
            EmailDomains = null;

            RaiseEvent(new OrganizationEmailDomainUpdatedEvent(this));
        }

        #endregion

        #region Guard methods

        private void ThrowIfEmailDomainIsInvalid(string emailDomain)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(emailDomain, nameof(emailDomain));
            ArgumentValidation.ThrowIfLongerThan255(emailDomain, nameof(emailDomain));

            if (!Regex.IsMatch(emailDomain, Constants.EmailDomainListValidationRegexp))
                throw new ArgumentException("Invalid email domain format", nameof(emailDomain));
        }

        private void ThrowIfUserEmailIsInvalid(string userEmail)
        {
            ArgumentValidation.ThrowIfNull(userEmail, nameof(userEmail));
            ArgumentValidation.ThrowIfNotValidEmail(userEmail, nameof(userEmail));
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, nameof(title));
            ArgumentValidation.ThrowIfLongerThan255(title, nameof(title));
        }

        #endregion

    }
}