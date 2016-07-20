using System;
using System.IdentityModel.Metadata;
using System.Web;
using easygenerator.Web.SAML.ServiceProvider.Providers;
using FluentAssertions;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.WebSso;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.SAML.ServiceProvider.Providers
{
    [TestClass]
    public class SignInCommandRunnerTests
    {
        private EntityId _entityId;
        private string _returnPath;
        private HttpRequestBase _httpRequestBase;
        private IOptions _options;
        private ISignInCommandRunner _commandRunner;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityId = new EntityId("http://localhost:666/saml/idp");
            _returnPath = "http://localhost:666";
            _httpRequestBase = new HttpRequestWrapper(new HttpRequest("", "http://localhost:666/saml/idp", ""));
            _options = new Options(new SPOptions()
            {
                EntityId = new EntityId("http://localhost:666/saml/sp"),
                ReturnUrl = new Uri("http://localhost:666")
            });
            _options.IdentityProviders.Add(new Kentor.AuthServices.IdentityProvider(_entityId, _options.SPOptions)
            {
                SingleSignOnServiceUrl = new Uri("http://localhost:666/saml/idp/Auth"),
                Binding = Saml2BindingType.HttpRedirect,
                WantAuthnRequestsSigned = false
            });
            _commandRunner = new SignInCommandRunner();
        }

        [TestMethod]
        public void Run_ShouldReturnAppropriateCommandResult()
        {
            var result = _commandRunner.Run(_entityId, _returnPath, _httpRequestBase, _options);
            result.Should().NotBeNull();
        }
    }
}
