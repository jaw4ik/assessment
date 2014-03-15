using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text.RegularExpressions;


namespace easygenerator.DomainModel.Entities
{
    public class User : Entity
    {
        protected internal User() { }

        protected internal User(string email, string password, string firstname, string lastname, string phone, string organization,
            string country, string createdBy, UserSettings userSettings, AccessType accessType, DateTime? accesTypeExpirationTime)
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
            AccessType = accessType;
            AccesTypeExpirationTime = accesTypeExpirationTime;
            PasswordRecoveryTicketCollection = new Collection<PasswordRecoveryTicket>();
            UserSetting = userSettings;
        }

        public string Email { get; protected set; }
        public string PasswordHash { get; private set; }

        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Phone { get; private set; }
        public string Organization { get; private set; }
        public string Country { get; private set; }
        public AccessType AccessType { get; protected internal set; }
        public DateTime? AccesTypeExpirationTime { get; protected internal set; }

        public virtual bool VerifyPassword(string password)
        {
            return Cryptography.VerifyHash(password, PasswordHash);
        }

        public string FullName
        {
            get
            {
                return (FirstName + " " + LastName).Trim();
            }
        }

        public virtual UserSettings UserSetting { get; private set; }

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

        public virtual bool HasAccess(AccessType accessType)
        {
            return AccessType >= accessType;
        }

        public virtual void DowngradeToFreeAccess(string modifiedBy)
        {
            AccessType = AccessType.Free;
            AccesTypeExpirationTime = null;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePassword(string password, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);
            ThrowIfPasswordIsNotValid(password);

            PasswordHash = Cryptography.GetHash(password);
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateFirstName(string firstName, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            FirstName = firstName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateLastName(string lastName, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LastName = lastName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePhone(string phone, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Phone = phone;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateOrganization(string organization, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Organization = organization;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateCountry(string country, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Country = country;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePlan(AccessType plan, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AccessType = plan;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateExpirationDate(DateTime expirationDate, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AccesTypeExpirationTime = expirationDate;
            MarkAsModified(modifiedBy);
        }

        public virtual bool IsPasswordValid(string password)
        {
            string errorMessage;
            return IsPasswordValid(password, out errorMessage);
        }

        private void ThrowIfEmailIsNotValid(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");

            if (email.Length > 254)
                throw new ArgumentException("Invalid email", "email");

            if (!Regex.IsMatch(email, Constants.EmailValidationRegexp))
                throw new ArgumentException("Invalid email format", "email");
        }

        private void ThrowIfPasswordIsNotValid(string password)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(password, "password");

            string errorMessage;
            if (!IsPasswordValid(password, out errorMessage))
            {
                throw new ArgumentException(errorMessage, "password");
            }
        }

        private bool IsPasswordValid(string password, out string message)
        {
            message = string.Empty;
            if (string.IsNullOrEmpty(password))
            {
                message = "Password cannot be empty";
                return false;
            }

            if (password.Length < 7)
            {
                message = "Password should be longer then 7 symbols";
                return false;
            }

            if (!Regex.IsMatch(password, @"\d"))
            {
                message = "Password should contain at least one digit symbol";
                return false;
            }

            if (!Regex.IsMatch(password, @"[A-Z]"))
            {
                message = "Password should contain at least one upper case symbol";
                return false;
            }

            if (!Regex.IsMatch(password, @"[a-z]"))
            {
                message = "Password should contain at least one lower case symbol";
                return false;
            }

            if (password.Contains(" "))
            {
                message = "Password should not contain whitespace symbols";
                return false;
            }

            return true;
        }

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
