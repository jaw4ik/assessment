using System;
using System.Collections.ObjectModel;
using System.IdentityModel.Metadata;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.SAML.ServiceProvider.Mappers;
using easygenerator.Web.SAML.ServiceProvider.Providers;
using FluentAssertions;
using Kentor.AuthServices.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.SAML.ServiceProvider.Providers
{
    [TestClass]
    public class OptionsProviderTests
    {
        private HttpContextBase _httpContext;
        private IAuthServicesOptionsProvider _authServicesOptionsProvider;
        private ISamlIdentityProviderRepository _samlIdentityProviderRepository;
        private IIdentityProviderMapper _identityProviderMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _authServicesOptionsProvider = Substitute.For<IAuthServicesOptionsProvider>();
            _authServicesOptionsProvider.Options.Returns(new Options(new SPOptions()
            {
                EntityId = new EntityId("http://localhost:666/saml/sp"),
                ReturnUrl = new Uri("http://localhost:666"),
                ModulePath = "/saml/sp"
            }));

            var request = Substitute.For<HttpRequestBase>();
            request.Url.Returns(new Uri("http://localhost:666/saml/idp"));
            _httpContext = Substitute.For<HttpContextBase>();
            _httpContext.Request.Returns(request);

            _samlIdentityProviderRepository = Substitute.For<ISamlIdentityProviderRepository>();
            _samlIdentityProviderRepository.GetCollection().Returns(new Collection<SamlIdentityProvider>());

            _identityProviderMapper = Substitute.For<IIdentityProviderMapper>();
        }

        [TestMethod]
        public void Ctor_ShouldInitializeOptions()
        {
            var optionsProvider = new OptionsProvider(_httpContext, _authServicesOptionsProvider, _samlIdentityProviderRepository, _identityProviderMapper);
            optionsProvider.Options.SPOptions.EntityId.Id.Should().Be("http://localhost:666/saml/sp");
        }

        [TestMethod]
        public void Options_ShouldReturnAppropriateOptions()
        {
            var optionsProvider = new OptionsProvider(_httpContext, _authServicesOptionsProvider, _samlIdentityProviderRepository, _identityProviderMapper);
            optionsProvider.Options.SPOptions.EntityId.Id.Should().Be("http://localhost:666/saml/sp");
            optionsProvider.Options.SPOptions.ReturnUrl.OriginalString.Should().Be("http://localhost:666");
        }
    }
}
