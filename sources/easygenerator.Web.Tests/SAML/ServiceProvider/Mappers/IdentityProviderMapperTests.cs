using System;
using System.IdentityModel.Metadata;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.SAML.ServiceProvider.Mappers;
using FluentAssertions;
using Kentor.AuthServices.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.SAML.ServiceProvider.Mappers
{
    [TestClass]
    public class IdentityProviderMapperTests
    {
        private SamlIdentityProvider _idP;
        private SPOptions _sPOptions;
        private IIdentityProviderMapper _identityProviderMapper;

        private const string Cert =
            "MIIDGzCCAgOgAwIBAgIJAMU4aW0pmv1hMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNVBAMMGXJwZXRyaXYuZWFzeWdlbmVyYXRvci5jb20wHhcNMTYwNTMxMDcwODM4WhcNMjYwNTI5MDcwODM4WjAkMSIwIAYDVQQDDBlycGV0cml2LmVhc3lnZW5lcmF0b3IuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApYZ+/4laJLp3kb2Kh3EagkT0liSnInDflOSOzXvPz480LrliwwDKhE6w5/EEOhq+wRrQjyFNK8s2l91HvfojmfjYpECXeYlotmFPCdjKQNINYG/8BJjZiwKwNvpg4NsIoP3wgmoxUvo4eeYzVHxEpmOnsWtnhaXDDLx+LqYKXb2RVL4p3wbowlwVLKqaUvqnzV0yckIsG8cc9N5w0BUogZ2w63IJp7x+HQI7jFQXr0P1FfBKLUX5DbHGbC0eRxdFJTnZ1xNhshAFbSln4MTymNUpAPQyywHDo8QUxwnDcWDSx/tYWrzN7LXVq0ImWQ1D6PdkEc4C01xxt6AjmVAcrwIDAQABo1AwTjAdBgNVHQ4EFgQUqbWNEnhSHgLj4Ty/r32kCMH2h2swHwYDVR0jBBgwFoAUqbWNEnhSHgLj4Ty/r32kCMH2h2swDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEATYA6/P/UhtHKGULx7NS+9d8CCtPr6gc5TcwyXd4oYakYRVF0nXjAKL/DIt/qyRaR9jN4BPvKowEvaHrfZUJqSRvB57W26Z59e8KplzwHO0FbzIaSZfY1SyPeRZ0cN5T4SSjJ/3r8yAktPa1DNewBg6IA2M13clFZ9Y52vUa1wXb89LLTM7gLOuyKjDTEpmVzt7hBFaHU2pkr3iOT1G+XR+kCOeQSKpJ3662GRnNPhxxiju8UzspyKZFsmnJJUBOX4NyurFXwt4ublXtB6xHCvGmdcF4JaH3AKRtpU8qxtY535Wpw4xdTrCtiMJyie2RBjwiQvKjXlCVo7M8VgILWHw==";

        [TestInitialize]
        public void InitializeContext()
        {
            _idP = new SamlIdentityProvider("name", "http://localhost:666/saml/idp",
                "http://localhost:666/saml/idp/Auth", null, 1, null, true, null, true, Cert);
            _sPOptions = new SPOptions()
            {
                EntityId = new EntityId("http://localhost:666/saml/sp"),
                ReturnUrl = new Uri("http://localhost:666"),
                ModulePath = "/saml/sp"
            };

            _identityProviderMapper = new IdentityProviderMapper();
        }

        [TestMethod]
        public void Map_ShouldReturnMappedIdP()
        {
            var idP = _identityProviderMapper.Map(_idP, _sPOptions);
            idP.EntityId.Id.Should().Be(_idP.EntityId);
            idP.AllowUnsolicitedAuthnResponse.Should().Be(true);
            ((short)(idP.Binding)).Should().Be(_idP.SingleSignOnServiceBinding);
            idP.SigningKeys.First().Should().NotBeNull();
            idP.SingleSignOnServiceUrl.OriginalString.Should().Be(_idP.SingleSignOnServiceUrl);
            idP.SingleLogoutServiceUrl.Should().BeNull();
        }
    }
}
