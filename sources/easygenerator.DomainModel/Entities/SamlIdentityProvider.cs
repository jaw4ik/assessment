using System.Collections.Generic;
using System.Collections.ObjectModel;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class SamlIdentityProvider : Identifiable
    {
        protected internal SamlIdentityProvider()
        {
            SamlIdPUserInfoes = new Collection<SamlIdPUserInfo>();
        }

        public SamlIdentityProvider(string name, string entityId, string singleSignOnServiceUrl, string singleLogoutServiceUrl, short singleSignOnServiceBinding,
            short? singleLogoutServiceBinding, bool allowUnsolicitedAuthnResponse, string metadataLocation, bool wantAuthnRequestsSigned, string signingCertificate)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, nameof(name));
            ArgumentValidation.ThrowIfNullOrEmpty(entityId, nameof(entityId));
            ArgumentValidation.ThrowIfNullOrEmpty(singleSignOnServiceUrl, nameof(singleSignOnServiceUrl));
            ArgumentValidation.ThrowIfNullOrEmpty(signingCertificate, nameof(signingCertificate));

            Name = name;
            EntityId = entityId;
            SingleSignOnServiceUrl = singleSignOnServiceUrl;
            SingleLogoutServiceUrl = singleLogoutServiceUrl;
            SingleSignOnServiceBinding = singleSignOnServiceBinding;
            SingleLogoutServiceBinding = singleLogoutServiceBinding;
            AllowUnsolicitedAuthnResponse = allowUnsolicitedAuthnResponse;
            MetadataLocation = metadataLocation;
            WantAuthnRequestsSigned = wantAuthnRequestsSigned;
            SigningCertificate = signingCertificate;

            SamlIdPUserInfoes = new Collection<SamlIdPUserInfo>();
        }

        public string Name { get; private set; }
        public string EntityId { get; private set; }
        public string SingleSignOnServiceUrl { get; private set; }
        public string SingleLogoutServiceUrl { get; private set; }
        public short SingleSignOnServiceBinding { get; private set; }
        public short? SingleLogoutServiceBinding { get; private set; }
        public bool AllowUnsolicitedAuthnResponse { get; private set; }
        public string MetadataLocation { get; private set; }
        public bool WantAuthnRequestsSigned { get; private set; }
        public string SigningCertificate { get; private set; }

        #region SamlIdPUserInfo
        protected internal virtual ICollection<SamlIdPUserInfo> SamlIdPUserInfoes { get; set; }
        #endregion

    }
}
