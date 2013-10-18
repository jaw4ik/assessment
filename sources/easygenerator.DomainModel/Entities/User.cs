using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using easygenerator.Infrastructure;


namespace easygenerator.DomainModel.Entities
{
    public class User : Entity
    {
        protected internal User() { }

        protected internal User(string email, string password, string createdBy)
            : base(createdBy)
        {
            ThrowIfEmailIsNotValid(email);
            ThrowIfPasswordIsNotValid(password);

            Email = email;
            PasswordHash = Cryptography.GetHash(password);
        }

        public string Email { get; protected set; }
        public string PasswordHash { get; private set; }

        public string FullName { get; private set; }
        public string Phone { get; private set; }
        public string Organization { get; private set; }

        public virtual void UpdateFullName(string fullName, string modifiedBy)
        {
            FullName = fullName;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePhone(string phone, string modifiedBy)
        {
            Phone = phone;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateOrganization(string organization, string modifiedBy)
        {
            Organization = organization;
            MarkAsModified(modifiedBy);
        }


        public virtual bool VerifyPassword(string password)
        {
            return Cryptography.VerifyHash(password, PasswordHash);
        }

        protected internal virtual ICollection<PasswordRecoveryTicket> PasswordRecoveryTicketCollection { get; set; }

        public string RequestPasswordRecoveryTicket()
        {
            var ticket = new PasswordRecoveryTicket();

            PasswordRecoveryTicketCollection.Add(ticket);

            return ticket.Id.ToString("N");
        }

        public void RecoverPasswordUsingTicket(string ticket, string password)
        {
            var item = PasswordRecoveryTicketCollection.SingleOrDefault(t => t.Id.ToString("N") == ticket);
            if (item != null)
            {
                PasswordHash = Cryptography.GetHash(password);
            }
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

            if (password.Length < 7)
                throw new ArgumentException("Password should be longer then 7 symbols", "password");

            if (!Regex.IsMatch(password, @"\d"))
                throw new ArgumentException("Password should contain at least one digit symbol", "password");

            if (!Regex.IsMatch(password, @"[A-Z]"))
                throw new ArgumentException("Password should contain at least one upper case symbol", "password");

            if (!Regex.IsMatch(password, @"[a-z]"))
                throw new ArgumentException("Password should contain at least one lower case symbol", "password");

            if (password.Contains(" "))
                throw new ArgumentException("Password should not contain whitespace symbols", "password");
        }
    }
}
