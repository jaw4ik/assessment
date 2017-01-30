using System;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class SamlIdPUserInfo : Identifiable
    {
        protected internal SamlIdPUserInfo() { }

        protected internal SamlIdPUserInfo(SamlIdentityProvider samlIdP, User user)
        {
            ArgumentValidation.ThrowIfNull(samlIdP, nameof(samlIdP));
            ArgumentValidation.ThrowIfNull(user, nameof(user));

            SamlIdP_Id = samlIdP.Id;
            User_Id = user.Id;
            SamlIdP = samlIdP;
            User = user;
        }

        public Guid SamlIdP_Id { get; private set; }
        public Guid User_Id { get; private set; }
        public virtual SamlIdentityProvider SamlIdP { get; private set; }
        public virtual User User { get; private set; }
    }
}
