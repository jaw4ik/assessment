using easygenerator.Auth.Providers.Cryptography;
using easygenerator.Auth.Security.Models;
using easygenerator.Auth.Security.Providers;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure.Serialization.Providers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Auth.Tests.Security.Providers
{
    [TestClass]
    public class SecureTokenProviderTests
    {
        private LtiUserInfoSecure _ltiUserInfoSecure;
        private ISerializationProvider<LtiUserInfoSecure> _serializationProvider;
        private ICryptographyConfigurationProvider _cryptographyConfigurationProvider;
        private ISecureTokenProvider<LtiUserInfoSecure> _secureTokenProvider;
        private const string SerializedData = "serialized data";

        [TestInitialize]
        public void Initialize()
        {
            _ltiUserInfoSecure = new LtiUserInfoSecure(LtiUserInfoObjectMother.Create());
            _serializationProvider = Substitute.For<ISerializationProvider<LtiUserInfoSecure>>();
            _cryptographyConfigurationProvider = Substitute.For<ICryptographyConfigurationProvider>();
            _secureTokenProvider = new SecureTokenProvider<LtiUserInfoSecure>(_serializationProvider, _cryptographyConfigurationProvider);
            _serializationProvider.Serialize(_ltiUserInfoSecure).Returns(SerializedData);
            _serializationProvider.Deserialize(SerializedData).Returns(_ltiUserInfoSecure);
        }

        #region GenerateToken

        [TestMethod]
        public void GenerateToken_ShouldGenerateTokenFromData()
        {
            var token = _secureTokenProvider.GenerateToken(_ltiUserInfoSecure);

            token.Length.Should().NotBe(0);
        }

        #endregion

        #region GetDataFromToken

        [TestMethod]
        public void GetDataFromToken_ShouldReturnObjectFromToken()
        {
            var token = _secureTokenProvider.GenerateToken(_ltiUserInfoSecure);
            var ltiUserInfoSecure = _secureTokenProvider.GetDataFromToken(token);

            ltiUserInfoSecure.LtiUserId.Should().Be(_ltiUserInfoSecure.LtiUserId);
            ltiUserInfoSecure.UserId.Should().Be(_ltiUserInfoSecure.UserId);
            ltiUserInfoSecure.ConsumerToolId.Should().Be(_ltiUserInfoSecure.ConsumerToolId);
        }

        #endregion
    }
}
