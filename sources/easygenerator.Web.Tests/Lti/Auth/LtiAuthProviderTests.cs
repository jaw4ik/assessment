using easygenerator.Auth.Providers;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Lti.Auth;
using LtiLibrary.Core.Common;
using LtiLibrary.Core.Lti1;
using LtiLibrary.Core.OAuth;
using LtiLibrary.Owin.Security.Lti.Provider;
using Microsoft.Owin;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using NSubstitute;
using FluentAssertions;

namespace easygenerator.Web.Tests.Lti.Auth
{
    [TestClass]
    public class LtiAuthProviderTests
    {
        private LtiAuthProvider _ltiAuthProvider;

        private IConsumerToolRepository _consumerToolRepository;
        private ITokenProvider _tokenProvider;
        private IUserRepository _userRepository;
        private IEntityFactory _entityFactory;
        private IDomainEventPublisher _eventPublisher;
        private IDependencyResolverWrapper _dependencyResolver;

        private LtiAuthenticatedContext _ltiAuthenticatedContext;
        private LtiAuthenticateContext _ltiAuthenticateContext;
        private ILtiRequest _ltiRequest;
        private IOwinResponse _owinResponse;
        private IOwinRequest _owinRequest;
        private Uri _uri;
        private string email = "email";
        private string name = "name";
        private string surName = "surName";

        [TestInitialize]
        public void Initialize()
        {
            DateTimeWrapper.Now = () => DateTime.Now;

            _consumerToolRepository = Substitute.For<IConsumerToolRepository>();
            _tokenProvider = Substitute.For<ITokenProvider>();
            _userRepository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _dependencyResolver = Substitute.For<IDependencyResolverWrapper>();

            _ltiRequest = Substitute.For<ILtiRequest>();
            _ltiAuthenticatedContext = Substitute.For<LtiAuthenticatedContext>(Substitute.For<IOwinContext>(), Substitute.For<LtiAuthOptions>(), _ltiRequest);
            _ltiAuthenticateContext = Substitute.For<LtiAuthenticateContext>(Substitute.For<IOwinContext>(), _ltiRequest);
            _owinResponse = Substitute.For<IOwinResponse>();
            _owinRequest = Substitute.For<IOwinRequest>();
            _uri = new Uri("http://example.com");
            _owinRequest.Uri.Returns(_uri);

            _ltiAuthenticatedContext.Response.Returns(_owinResponse);
            _ltiAuthenticatedContext.Request.Returns(_owinRequest);

            _ltiAuthProvider = new LtiAuthProvider(_consumerToolRepository, _tokenProvider, _userRepository, _entityFactory, _eventPublisher, _dependencyResolver);
        }

        [TestMethod]
        public void OnAuthenticate_ShouldThrowExceptionIfRequestWasExpired()
        {
            _ltiRequest.Timestamp.Returns(0);
            Action action = () => _ltiAuthProvider.OnAuthenticate(_ltiAuthenticateContext);
            action.ShouldThrow<LtiException>().And.Message.Should().Be("Expired " + OAuthConstants.TimestampParameter);
        }

        [TestMethod]
        public void OnAuthenticate_ShouldThrowExceptionIfConsumerWithRequestedKeyDoesntExist()
        {
            _ltiRequest.ConsumerKey.Returns("key");
            DateTimeWrapper.Now = () => OAuthConstants.Epoch.ToUniversalTime();
            Action action = () => _ltiAuthProvider.OnAuthenticate(_ltiAuthenticateContext);
            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid " + OAuthConstants.ConsumerKeyParameter);
        }

        [TestMethod]
        public void OnAuthenticate_ShouldThrowExceptionIfSignatureIsNotCorrect()
        {
            _ltiRequest.ConsumerKey.Returns("key");
            _ltiRequest.Signature.Returns("signature1");
            _consumerToolRepository.GetByKey(Arg.Any<string>()).Returns(Substitute.For<ConsumerTool>());
            DateTimeWrapper.Now = () => OAuthConstants.Epoch.ToUniversalTime();
            Action action = () => _ltiAuthProvider.OnAuthenticate(_ltiAuthenticateContext);
            _ltiRequest.GenerateSignature(Arg.Any<string>()).Returns("signature2");

            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid " + OAuthConstants.SignatureParameter);
        }

    }
}
