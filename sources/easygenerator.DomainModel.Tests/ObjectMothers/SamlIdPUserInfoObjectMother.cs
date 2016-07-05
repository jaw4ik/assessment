using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class SamlIdPUserInfoObjectMother
    {
        public static SamlIdPUserInfo Create(SamlIdentityProvider samlIdentityProvider = null, User user = null)
        {
            return new SamlIdPUserInfo(samlIdentityProvider ?? new SamlIdentityProvider(), user ?? UserObjectMother.CreateWithEmail("email@mail.ua"));
        }
    }
}
