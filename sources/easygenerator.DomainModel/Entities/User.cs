﻿using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Entities.Tickets;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    public class User : Entity
    {
        private const int TrialPeriodDays = 14;

        protected internal User() { }

        protected internal User(string email, string password, string firstname, string lastname, string phone, string country, string role, string createdBy,
            AccessType accessPlan, string lastReadReleaseNote, DateTime? expirationDate = null, bool isCreatedThroughLti = false,
            ICollection<Company> companiesCollection = null, bool? newEditor = true, bool isNewEditorByDefault = true, bool includeMediaToPackage = false)
            : base(createdBy)
        {
            ThrowIfEmailIsNotValid(email);
            ThrowIfPasswordIsNotValid(password);
            ArgumentValidation.ThrowIfNullOrEmpty(firstname, nameof(firstname));
            ArgumentValidation.ThrowIfNullOrEmpty(lastname, nameof(lastname));
            ArgumentValidation.ThrowIfNullOrEmpty(phone, nameof(phone));
            ArgumentValidation.ThrowIfNullOrEmpty(country, nameof(country));

            Email = email;
            PasswordHash = Cryptography.GetHash(password);
            FirstName = firstname;
            LastName = lastname;
            Phone = phone;
            Country = country;
            Role = role;
            TicketCollection = new Collection<Ticket>();
            CompaniesCollection = companiesCollection ?? new Collection<Company>();
            LtiUserInfoes = new Collection<LtiUserInfo>();
            Settings = new UserSettings(createdBy, lastReadReleaseNote, isCreatedThroughLti, newEditor, isNewEditorByDefault, includeMediaToPackage);

            AccessType = accessPlan;

            if (expirationDate.HasValue)
            {
                ThrowIfExpirationDateIsInvalid(expirationDate);
                ExpirationDate = expirationDate;
            }
            else
            {
                ExpirationDate = CreatedOn.AddDays(TrialPeriodDays);
            }
        }

        public string Email { get; protected set; }
        public bool IsEmailConfirmed { get; protected set; }
        public string PasswordHash { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Phone { get; private set; }
        public string Organization { get; private set; }
        public string Role { get; private set; }
        public string Country { get; private set; }
        public AccessType AccessType { get; protected internal set; }
        public DateTime? ExpirationDate { get; protected internal set; }
        protected internal virtual ICollection<Company> CompaniesCollection { get; set; }
        public virtual IEnumerable<Company> Companies => CompaniesCollection.OrderByDescending(e => e.Priority).ThenBy(e => e.CreatedOn).AsEnumerable();
        protected internal virtual ICollection<Organization> OrganizationsCollection { get; set; }
        public virtual IEnumerable<Organization> Organizations => OrganizationsCollection.AsEnumerable();

        public virtual void AddCompany(Company company, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNull(company, nameof(company));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!CompaniesCollection.Contains(company))
            {
                CompaniesCollection.Add(company);
                MarkAsModified(modifiedBy);
            }
        }

        public virtual void RemoveCompany(Company company, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNull(company, nameof(company));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            CompaniesCollection.Remove(company);

            MarkAsModified(modifiedBy);
        }

        public virtual bool VerifyPassword(string password)
        {
            return Cryptography.VerifyHash(password, PasswordHash);
        }

        public string FullName => (FirstName + " " + LastName).Trim();

        protected internal virtual ICollection<Ticket> TicketCollection { get; set; }

        public virtual void UpdatePassword(string password, string modifiedBy)
        {
            ThrowIfPasswordIsNotValid(password);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            PasswordHash = Cryptography.GetHash(password);
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateFirstName(string firstName, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(firstName, nameof(firstName));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            FirstName = firstName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateLastName(string lastName, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(lastName, nameof(lastName));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LastName = lastName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePhone(string phone, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(phone, nameof(phone));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Phone = phone;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateOrganization(string organization, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(organization, nameof(organization));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Organization = organization;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateCountry(string country, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(country, nameof(country));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Country = country;
            MarkAsModified(modifiedBy);
        }

        public virtual UserSettings Settings { get; set; }

        #region Email confirmation

        public virtual EmailConfirmationTicket GetEmailConfirmationTicket()
        {
            return TicketCollection.SingleOrDefault(t => t is EmailConfirmationTicket) as EmailConfirmationTicket;
        }

        public virtual void AddEmailConfirmationTicket(EmailConfirmationTicket ticket)
        {
            AddUniqueTicket(ticket);
        }

        public virtual void ConfirmEmailUsingTicket(EmailConfirmationTicket ticket)
        {
            ArgumentValidation.ThrowIfNull(ticket, nameof(ticket));

            var item = TicketCollection.SingleOrDefault(t => t == ticket);
            if (item == null)
            {
                throw new InvalidOperationException("Ticket does not exist");
            }

            TicketCollection.Remove(ticket);
            if (IsEmailConfirmed)
                return;

            IsEmailConfirmed = true;
            RaiseEvent(new UserEmailConfirmedEvent(this));
        }

        #endregion

        #region Password recovery

        public virtual void AddPasswordRecoveryTicket(PasswordRecoveryTicket ticket)
        {
            AddUniqueTicket(ticket);
        }

        private void AddUniqueTicket<T>(T ticket) where T : Ticket
        {
            ArgumentValidation.ThrowIfNull(ticket, nameof(ticket));
            var tickets = TicketCollection.Where(t => t is T).ToList();
            foreach (var existingTicket in tickets)
            {
                TicketCollection.Remove(existingTicket);
            }

            ticket.User = this;
            TicketCollection.Add(ticket);
        }

        public virtual void RecoverPasswordUsingTicket(PasswordRecoveryTicket ticket, string password)
        {
            ArgumentValidation.ThrowIfNull(ticket, nameof(ticket));
            ThrowIfPasswordIsNotValid(password);

            var item = TicketCollection.SingleOrDefault(t => t == ticket);
            if (item == null)
                throw new InvalidOperationException("Ticket does not exist");

            PasswordHash = Cryptography.GetHash(password);
            TicketCollection.Remove(ticket);

            RaiseEvent(new UserUpdateEvent(this, password));
        }

        #endregion

        #region User access

        public virtual bool IsFreeAccess()
        {
            return AccessType == AccessType.Free || IsAccessExpired();
        }

        public virtual bool HasStarterAccess()
        {
            return AccessType >= AccessType.Starter && !IsAccessExpired();
        }

        public virtual bool HasPlusAccess()
        {
            return AccessType >= AccessType.Plus && !IsAccessExpired();
        }

        public virtual bool HasAcademyAccess()
        {
            return AccessType >= AccessType.Academy && !IsAccessExpired();
        }
        public virtual bool HasAcademyBTAccess()
        {
            return AccessType >= AccessType.AcademyBT && !IsAccessExpired();
        }

        public virtual bool HasTrialAccess()
        {
            return AccessType == AccessType.Trial && !IsAccessExpired();
        }

        private bool IsAccessExpired()
        {
            if (!ExpirationDate.HasValue)
                return true;

            return ExpirationDate.Value < DateTimeWrapper.Now();
        }

        public virtual void UpgradePlanToStarter(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.Starter;
            ExpirationDate = expirationDate;

            RaiseEvent(new UserUpgradedToStarter(this));
        }

        public void UpgradePlanToPlus(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.Plus;
            ExpirationDate = expirationDate;
            RaiseEvent(new UserUpgradedToPlus(this));
        }

        public void UpgradePlanToAcademy(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.Academy;
            ExpirationDate = expirationDate;
            RaiseEvent(new UserUpgradedToAcademy(this));
        }

        public void UpgradePlanToAcademyBT(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.AcademyBT;
            ExpirationDate = expirationDate;
            RaiseEvent(new UserUpgradedToAcademyBT(this));
        }

        public virtual void DowngradePlanToFree()
        {
            AccessType = AccessType.Free;
            ExpirationDate = null;

            RaiseEvent(new UserDowngraded(this));
        }

        #endregion

        #region Guard methods

        private void ThrowIfEmailIsNotValid(string email)
        {
            ArgumentValidation.ThrowIfNotValidEmail(email, nameof(email));
        }

        private void ThrowIfPasswordIsNotValid(string password)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(password, nameof(password));

            if (password.Length < 7)
                throw new ArgumentException("Password should not be less than 7 symbols", nameof(password));

            if (password.Contains(" "))
                throw new ArgumentException("Password should not contain whitespace symbols", nameof(password));
        }

        private static void ThrowIfExpirationDateIsInvalid(DateTime? expirationDate)
        {
            if (expirationDate < DateTimeWrapper.MinValue())
            {
                throw new ArgumentException("Expiration date is invalid", nameof(expirationDate));
            }
        }

        #endregion

        #region LtiUserInfo
        protected internal virtual ICollection<LtiUserInfo> LtiUserInfoes { get; set; }

        public virtual LtiUserInfo GetLtiUserInfo(string ltiUserId, ConsumerTool consumerTool)
        {
            ArgumentValidation.ThrowIfNull(consumerTool, nameof(consumerTool));
            return LtiUserInfoes.SingleOrDefault(e => e.ConsumerTool == consumerTool && e.LtiUserId == ltiUserId);
        }

        public virtual void AddLtiUserInfo(string ltiUserId, ConsumerTool consumerTool)
        {
            if (GetLtiUserInfo(ltiUserId, consumerTool) == null)
            {
                LtiUserInfoes.Add(new LtiUserInfo(ltiUserId, consumerTool, this));
            }
        }

        public virtual void AddLtiUserInfo(LtiUserInfo ltiUserInfo)
        {
            if (GetLtiUserInfo(ltiUserInfo.LtiUserId, ltiUserInfo.ConsumerTool) == null)
            {
                LtiUserInfoes.Add(ltiUserInfo);
            }
        }
        #endregion
    }
}
