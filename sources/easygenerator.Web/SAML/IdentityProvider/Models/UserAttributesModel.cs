using System;
using System.IdentityModel.Claims;

namespace easygenerator.Web.SAML.IdentityProvider.Models
{
    public class UserAttributesModel
    {
        public UserAttributesModel(string givenName, string surname, string fullName)
        {
            if (string.IsNullOrEmpty(givenName))
            {
                throw new ArgumentException(nameof(givenName));
            }
            if (string.IsNullOrEmpty(surname))
            {
                throw new ArgumentException(nameof(surname));
            }
            if (string.IsNullOrEmpty(fullName))
            {
                throw new ArgumentException(nameof(fullName));
            }
            GivenName = new AttributeStatementModel
            {
                Type = ClaimTypes.GivenName,
                Value = givenName
            };
            Surname = new AttributeStatementModel
            {
                Type = ClaimTypes.Surname,
                Value = surname
            };
            FullName = new AttributeStatementModel
            {
                Type = ClaimTypes.Name,
                Value = fullName
            };
        }
        public AttributeStatementModel GivenName { get; }
        public AttributeStatementModel Surname { get; }
        public AttributeStatementModel FullName { get; }
    }
}
