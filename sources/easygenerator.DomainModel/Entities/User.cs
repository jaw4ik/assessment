﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text.RegularExpressions;
using easygenerator.Infrastructure;


namespace easygenerator.DomainModel.Entities
{
    public class User : Entity
    {
        protected internal User() { }

        protected internal User(string email, string password, string fullname, string phone, string organization,
            string country, string createdBy)
            : base(createdBy)
        {
            ThrowIfEmailIsNotValid(email);
            ThrowIfPasswordIsNotValid(password);
            ArgumentValidation.ThrowIfNullOrEmpty(fullname, "fullName");
            ArgumentValidation.ThrowIfNullOrEmpty(phone, "phone");
            ArgumentValidation.ThrowIfNullOrEmpty(organization, "organization");
            ArgumentValidation.ThrowIfNullOrEmpty(country, "country");

            Email = email;
            PasswordHash = Cryptography.GetHash(password);
            FullName = fullname;
            Phone = phone;
            Organization = organization;
            Country = country;
            PasswordRecoveryTicketCollection = new Collection<PasswordRecoveryTicket>();
        }

        public string Email { get; protected set; }
        public string PasswordHash { get; private set; }

        public string FullName { get; private set; }
        public string Phone { get; private set; }
        public string Organization { get; private set; }
        public string Country { get; private set; }

        public virtual bool VerifyPassword(string password)
        {
            return Cryptography.VerifyHash(password, PasswordHash);
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
