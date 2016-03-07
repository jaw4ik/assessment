using System;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Models
{
    public class User
    {
        protected User() { }
        public User(string email, AccessType accessType)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email cannot be empty or white space", nameof(email));
            }

            Email = email;
            AccessType = accessType;
            ModifiedOn = DateTimeWrapper.Now();
        }

        public string Email { get; private set; }
        public DateTime ModifiedOn { get; private set; }
        public AccessType AccessType { get; private set; }
    }
}
