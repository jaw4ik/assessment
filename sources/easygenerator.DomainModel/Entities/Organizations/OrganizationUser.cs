using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Organizations
{
    public class OrganizationUser : Entity
    {
        public virtual Organization Organization { get; protected internal set; }
        public virtual string Email { get; protected internal set; }
        public bool IsAdmin { get; protected internal set; }
        public OrganizationUserStatus Status { get; protected internal set; }

        protected internal OrganizationUser() { }

        protected internal OrganizationUser(Organization organization, string email, bool isAdmin, OrganizationUserStatus status, string createdBy)
            : base(createdBy)
        {
            ThrowIfOrganizationIsInvalid(organization);
            ThrowIfEmailIsNotValid(email);

            Organization = organization;
            Email = email;
            IsAdmin = isAdmin;
            Status = status;
        }

        public virtual void AcceptInvite()
        {
            if (Status == OrganizationUserStatus.Accepted)
                return;

            Status = OrganizationUserStatus.Accepted;
            RaiseEvent(new OrganizationInviteAcceptedEvent(Organization, this));
        }

        public virtual void DeclineInvite()
        {
            if (Status == OrganizationUserStatus.Declined)
                return;

            Status = OrganizationUserStatus.Declined;
            RaiseEvent(new OrganizationInviteDeclinedEvent(Organization, this));
        }

        public virtual void Reinvite()
        {
            if (Status == OrganizationUserStatus.WaitingForAcceptance)
                return;

            Status = OrganizationUserStatus.WaitingForAcceptance;
            RaiseEvent(new OrganizationUserReinvitedEvent(Organization, this));
        }

        #region Guard methods

        private void ThrowIfOrganizationIsInvalid(Organization organization)
        {
            ArgumentValidation.ThrowIfNull(organization, "organization");
        }

        private void ThrowIfEmailIsNotValid(string userEmail)
        {
            ArgumentValidation.ThrowIfNotValidEmail(userEmail, "userEmail");
        }

        #endregion
    }
}