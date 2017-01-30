using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Users
{
    public class UserDomain
    {
        public string Domain { get; protected internal set; }
        public int NumberOfUsers { get; protected internal set; }
        public bool Tracked { get; protected internal set; }

        public UserDomain(){ }

        public UserDomain(string domain, int numberOfUsers, bool tracked)
        {
            ThrowIfDomainIsInvalid(domain);
            ArgumentValidation.ThrowIfNull(numberOfUsers, nameof(numberOfUsers));
            ArgumentValidation.ThrowIfNull(tracked, nameof(tracked));

            Domain = domain;
            NumberOfUsers = numberOfUsers;
            Tracked = tracked;
        }

        private void ThrowIfDomainIsInvalid(string domain)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(domain, nameof(domain));
            ArgumentValidation.ThrowIfLongerThan255(domain, nameof(domain));
        }

        public void IncreaseUsersNumber()
        {
            NumberOfUsers++;
        }

        public void UpdateTrackedValue(bool tracked)
        {
            Tracked = tracked;
        }
    }
}
