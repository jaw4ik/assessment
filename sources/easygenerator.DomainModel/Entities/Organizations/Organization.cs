using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities.Organizations
{
    public class Organization : Entity
    {
        protected internal Organization()
        {
            UserCollection = new Collection<OrganizationUser>();
        }

        protected internal Organization(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            UserCollection = new Collection<OrganizationUser>();
            UserCollection.Add(new OrganizationUser(this, createdBy, true, OrganizationUserStatus.Accepted, createdBy));
        }

        public string Title { get; protected internal set; }

        protected internal virtual ICollection<OrganizationUser> UserCollection { get; set; }
        public virtual IEnumerable<OrganizationUser> Users => UserCollection.AsEnumerable();

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);

            RaiseEvent(new OrganizationTitleUpdatedEvent(this));
        }

        public virtual OrganizationUser AddUser(string email, string createdBy)
        {
            ThrowIfUserEmailIsInvalid(email);
            if (Users.Any(e => e.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase)))
                return null;

            var organizationUser = new OrganizationUser(this, email, false, OrganizationUserStatus.WaitingForAcceptance, createdBy);
            UserCollection.Add(organizationUser);

            MarkAsModified(createdBy);
            RaiseEvent(new OrganizationUserAddedEvent(this, organizationUser));

            return organizationUser;
        }

        public virtual bool RemoveUser(string email, string modifiedBy)
        {
            var organizationUser = UserCollection.FirstOrDefault(e => e.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase));
            if (organizationUser == null)
            {
                return false;
            }

            if (organizationUser.IsAdmin && UserCollection.Count(e => e.IsAdmin) == 1)
            {
                throw new InvalidOperationException("Cannot remove last admin user from organization");
            }

            organizationUser.Organization = null;
            UserCollection.Remove(organizationUser);

            MarkAsModified(modifiedBy);
            RaiseEvent(new OrganizationUserRemovedEvent(this, organizationUser));

            return true;
        }

        #region Guard methods

        private void ThrowIfOrganizationUserIsInvalid(OrganizationUser user)
        {
            ArgumentValidation.ThrowIfNull(user, nameof(user));
        }

        private void ThrowIfUserEmailIsInvalid(string userEmail)
        {
            ArgumentValidation.ThrowIfNull(userEmail, nameof(userEmail));
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, nameof(title));
            ArgumentValidation.ThrowIfLongerThan255(title, nameof(title));
        }

        #endregion
    }
}