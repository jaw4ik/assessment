﻿using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text.RegularExpressions;

namespace easygenerator.DomainModel.Entities
{
    public class User : Entity
    {
        private const int TrialPeriodDays = 14;

        protected internal User() { }

        protected internal User(string email, string password, string firstname, string lastname, string phone, string organization, string country, string createdBy)
            : base(createdBy)
        {
            ThrowIfEmailIsNotValid(email);
            ThrowIfPasswordIsNotValid(password);
            ArgumentValidation.ThrowIfNullOrEmpty(firstname, "firstname");
            ArgumentValidation.ThrowIfNullOrEmpty(lastname, "lastname");
            ArgumentValidation.ThrowIfNullOrEmpty(phone, "phone");
            ArgumentValidation.ThrowIfNullOrEmpty(organization, "organization");
            ArgumentValidation.ThrowIfNullOrEmpty(country, "country");

            Email = email;
            PasswordHash = Cryptography.GetHash(password);
            FirstName = firstname;
            LastName = lastname;
            Phone = phone;
            Organization = organization;
            Country = country;
            PasswordRecoveryTicketCollection = new Collection<PasswordRecoveryTicket>();

            AccessType = AccessType.Plus;
            ExpirationDate = CreatedOn.AddDays(TrialPeriodDays);
        }

        public string Email { get; protected set; }
        public string PasswordHash { get; private set; }

        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Phone { get; private set; }
        public string Organization { get; private set; }
        public string Country { get; private set; }
        public AccessType AccessType { get; protected internal set; }
        public DateTime? ExpirationDate { get; protected internal set; }

        public virtual bool VerifyPassword(string password)
        {
            return Cryptography.VerifyHash(password, PasswordHash);
        }

        public string FullName
        {
            get { return (FirstName + " " + LastName).Trim(); }
        }

        protected internal virtual ICollection<PasswordRecoveryTicket> PasswordRecoveryTicketCollection { get; set; }

        public virtual void AddPasswordRecoveryTicket(PasswordRecoveryTicket ticket)
        {
            foreach (var passwordRecoveryTicket in PasswordRecoveryTicketCollection)
            {
                passwordRecoveryTicket.User = null;
            }
            PasswordRecoveryTicketCollection = new Collection<PasswordRecoveryTicket> { ticket };
            ticket.User = this;
        }

        public virtual void RecoverPasswordUsingTicket(PasswordRecoveryTicket ticket, string password)
        {
            ArgumentValidation.ThrowIfNull(ticket, "ticket");
            ThrowIfPasswordIsNotValid(password);

            var item = PasswordRecoveryTicketCollection.SingleOrDefault(t => t == ticket);
            if (item == null)
                throw new InvalidOperationException("Ticket does not exist");

            PasswordHash = Cryptography.GetHash(password);
            PasswordRecoveryTicketCollection.Remove(ticket);
        }

        public virtual bool HasStarterAccess()
        {
            return AccessType >= AccessType.Starter && !IsAccessExpired();
        }

        public virtual bool HasPlusAccess()
        {
            return AccessType >= AccessType.Plus && !IsAccessExpired();
        }

        private bool IsAccessExpired()
        {
            if (!ExpirationDate.HasValue)
                return true;

            return ExpirationDate.Value < DateTimeWrapper.Now();
        }

        public virtual void UpdatePassword(string password, string modifiedBy)
        {
            ThrowIfPasswordIsNotValid(password);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            PasswordHash = Cryptography.GetHash(password);
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateFirstName(string firstName, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(firstName, "firstName");
            ThrowIfModifiedByIsInvalid(modifiedBy);

            FirstName = firstName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateLastName(string lastName, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(lastName, "lastName");
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LastName = lastName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePhone(string phone, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(phone, "phone");
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Phone = phone;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateOrganization(string organization, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(organization, "organization");
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Organization = organization;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateCountry(string country, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(country, "country");
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Country = country;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpgradePlanToStarter(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.Starter;
            ExpirationDate = expirationDate;
        }

        public void UpgradePlanToPlus(DateTime expirationDate)
        {
            ThrowIfExpirationDateIsInvalid(expirationDate);

            AccessType = AccessType.Plus;
            ExpirationDate = expirationDate;
        }

        public virtual void DowngradePlanToFree()
        {
            AccessType = AccessType.Free;
            ExpirationDate = null;
        }

        private void ThrowIfEmailIsNotValid(string email)
        {
            ArgumentValidation.ThrowIfNotValidEmail(email, "email");
        }

        private void ThrowIfPasswordIsNotValid(string password)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(password, "password");

            if (password.Length < 7)
                throw new ArgumentException("Password should not be less than 7 symbols", "password");

            if (password.Contains(" "))
                throw new ArgumentException("Password should not contain whitespace symbols", "password");
        }

        private static void ThrowIfExpirationDateIsInvalid(DateTime? expirationDate)
        {
            if (expirationDate < DateTimeWrapper.MinValue())
            {
                throw new ArgumentException("Expiration date is invalid", "expirationDate");
            }
        }
    }
}
