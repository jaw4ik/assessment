using System.Collections.Generic;
using System.Collections.Specialized;
using easygenerator.Auth.Lti;
using easygenerator.Auth.Models;
using easygenerator.Auth.Providers;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using LtiLibrary.Core.Common;
using LtiLibrary.Core.Lti1;
using LtiLibrary.Core.OAuth;
using LtiLibrary.Owin.Security.Lti.Provider;
using Microsoft.Owin;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using NSubstitute;
using FluentAssertions;

namespace easygenerator.Auth.Tests.Lti
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
        private IUnitOfWork _unitOfWork;
        private IReleaseNoteFileReader _releaseNoteFileReader;

        private LtiAuthenticatedContext _ltiAuthenticatedContext;
        private LtiAuthenticateContext _ltiAuthenticateContext;
        private ILtiRequest _ltiRequest;
        private IOwinResponse _owinResponse;
        private IOwinRequest _owinRequest;
        private Uri _uri;

        private string email = "email@example.com";
        private string firstName = "firstName";
        private string lastName = "lastName";
        private string userId = "2";
        private string ltiMockData = "LTI";
        private string authToken = "auth_token";

        private NameValueCollection _ltiRequestParams;

        [TestInitialize]
        public void Initialize()
        {
            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);

            _consumerToolRepository = Substitute.For<IConsumerToolRepository>();
            _tokenProvider = Substitute.For<ITokenProvider>();
            _userRepository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _dependencyResolver = Substitute.For<IDependencyResolverWrapper>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _releaseNoteFileReader = Substitute.For<IReleaseNoteFileReader>();

            _dependencyResolver.GetService<IUnitOfWork>().Returns(_unitOfWork);
            _dependencyResolver.GetService<IUserRepository>().Returns(_userRepository);

            _ltiRequest = Substitute.For<ILtiRequest>();
            _ltiAuthenticatedContext = Substitute.For<LtiAuthenticatedContext>(Substitute.For<IOwinContext>(), Substitute.For<LtiAuthOptions>(), _ltiRequest);
            _ltiAuthenticateContext = Substitute.For<LtiAuthenticateContext>(Substitute.For<IOwinContext>(), _ltiRequest);
            _owinResponse = Substitute.For<IOwinResponse>();
            _owinRequest = Substitute.For<IOwinRequest>();
            _uri = new Uri("http://example.com/lti/launch");
            _owinRequest.Uri.Returns(_uri);
            _ltiRequestParams = new NameValueCollection();
            _ltiRequest.Parameters.Returns(_ltiRequestParams);
            _tokenProvider.GenerateTokens(email, _uri.Host, Arg.Any<string[]>()).Returns(new List<TokenModel> { new TokenModel { Token = "auth_token" } });

            _ltiAuthenticatedContext.Response.Returns(_owinResponse);
            _ltiAuthenticatedContext.Request.Returns(_owinRequest);

            _ltiAuthProvider = new LtiAuthProvider(_consumerToolRepository, _tokenProvider, _userRepository, _entityFactory, _eventPublisher, _dependencyResolver, _releaseNoteFileReader);
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

        [TestMethod]
        public void OnAuthenticated_ShouldThrowExceptionIfEmailIsNull()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns((string)null);
            Action action = () => _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid LisPersonEmailPrimary: Email of the user is null or white space.");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldThrowExceptionIfEmailIsWhiteSpace()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns("   ");
            Action action = () => _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid LisPersonEmailPrimary: Email of the user is null or white space.");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldCreateUserIfItDoesNotExist()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Plus, user.LastReadReleaseNote, DateTimeWrapper.Now().AddYears(50)).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _userRepository.Received().Add(Arg.Is<User>(_ => _ == user && _.LtiUserInfo.LtiUserId == userId));
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void OnAuthenticated_ShouldRaiseEventAboutCreationInitialData_IfUserDoesNotExist()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Plus, user.LastReadReleaseNote, DateTimeWrapper.Now().AddYears(50)).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _eventPublisher.Received().Publish(Arg.Is<CreateUserInitialDataEvent>(_ => _.User == user));
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnLogOuReturntUrl_IfUserExistsAndHeIsNotLtiUser()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _userRepository.GetUserByEmail(email).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be(string.Format("{0}#logout", _uri.GetLeftPart(UriPartial.Authority)));
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnLogOuReturntUrl_IfUserExistsAndHeHasDiffferentUserId()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);
            user.UpdateLtiUserInfo("3");

            _userRepository.GetUserByEmail(email).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be(string.Format("{0}#logout", _uri.GetLeftPart(UriPartial.Authority)));
        }

        [TestMethod]
        public void OnAuthenticated_ShouldSetReturnUrlToProperValue_WhenToolUrlIsNotSpecifiedInParam()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Plus, user.LastReadReleaseNote, DateTimeWrapper.Now().AddYears(50)).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be(string.Format("{0}#token.auth={1}", _uri.GetLeftPart(UriPartial.Authority), authToken));
        }

        [TestMethod]
        public void OnAuthenticated_ShouldSetReturnUrlToProperValue_WhenToolUrlSpecifiedInParam()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var customUrl = "http://localhost/";

            _ltiRequestParams.Add(easygenerator.Auth.Lti.Constants.ToolProviderUrl, customUrl);
            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Plus, user.LastReadReleaseNote, DateTimeWrapper.Now().AddYears(50)).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be(string.Format("{0}#token.auth={1}", customUrl, authToken));
        }
    }
}
