using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace easygenerator.Web.SAML.IdentityProvider.Models
{
    public class AssertionModel
    {
        public AssertionModel()
        {
            AttributeStatements = new Collection<AttributeStatementModel>();
        }
        public string AssertionConsumerServiceUrl { get; set; }
        public string RelayState { get; set; }
        public string NameId { get; set; }
        public string Audience { get; set; }
        public ICollection<AttributeStatementModel> AttributeStatements { get; }
        public string InResponseTo { get; set; }
    }
}
