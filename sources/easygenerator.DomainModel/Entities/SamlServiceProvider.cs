using System.Collections.Generic;
using System.Collections.ObjectModel;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class SamlServiceProvider : Identifiable
    {
        public SamlServiceProvider()
        {
            Users = new Collection<User>();
        }

        public SamlServiceProvider(string assertionConsumerService, string issuer)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(assertionConsumerService, nameof(assertionConsumerService));
            ArgumentValidation.ThrowIfNullOrEmpty(issuer, nameof(issuer));

            Users = new Collection<User>();
            AssertionConsumerServiceUrl = assertionConsumerService;
            Issuer = issuer;
        }
        
        public string AssertionConsumerServiceUrl { get; private set; }
        public string Issuer { get; private set; }

        #region Users
        protected internal virtual ICollection<User> Users { get; set; }
        #endregion
    }
}
