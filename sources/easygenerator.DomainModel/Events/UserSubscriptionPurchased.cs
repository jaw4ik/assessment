using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class UserSubscriptionPurchased
    {
        public User User { get; private set; }

        public UserSubscriptionPurchased(User user)
        {
            ThrowIfUserIsInvalid(user);

            User = user;
        }

        private void ThrowIfUserIsInvalid(User user)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
        }
    }
}
