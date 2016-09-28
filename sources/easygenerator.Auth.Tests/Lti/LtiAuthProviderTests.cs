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
using System.Collections.ObjectModel;
using easygenerator.Auth.Security.Models;
using easygenerator.Auth.Security.Providers;
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
        private IUnitOfWork _unitOfWork;
        private IReleaseNoteFileReader _releaseNoteFileReader;
        private ISurveyPopupSettingsProvider _surveyPopupVersionReader;
        private ISecureTokenProvider<ISecure<LtiUserInfo>> _secureTokenProvider;

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
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _releaseNoteFileReader = Substitute.For<IReleaseNoteFileReader>();
            _surveyPopupVersionReader = Substitute.For<ISurveyPopupSettingsProvider>();
            _secureTokenProvider = Substitute.For<ISecureTokenProvider<ISecure<LtiUserInfo>>>();

            _ltiRequest = Substitute.For<ILtiRequest>();
            _ltiAuthenticatedContext = Substitute.For<LtiAuthenticatedContext>(Substitute.For<IOwinContext>(), Substitute.For<LtiAuthOptions>(), _ltiRequest);
            _ltiAuthenticateContext = Substitute.For<LtiAuthenticateContext>(Substitute.For<IOwinContext>(), _ltiRequest);
            _owinResponse = Substitute.For<IOwinResponse>();
            _owinRequest = Substitute.For<IOwinRequest>();
            _uri = new Uri("http://example.com/lti/launch");
            _owinRequest.Uri.Returns(_uri);
            _ltiRequestParams = new NameValueCollection();
            _ltiRequest.Parameters.Returns(_ltiRequestParams);
            _tokenProvider.GenerateTokens(email, _uri.Host, Arg.Any<string[]>(), DateTimeWrapper.Now().ToUniversalTime().AddMinutes(5)).Returns(new List<TokenModel> { new TokenModel { Token = "auth_token" } });

            _ltiAuthenticatedContext.Response.Returns(_owinResponse);
            _ltiAuthenticatedContext.Request.Returns(_owinRequest);

            _ltiAuthProvider = new LtiAuthProvider(_consumerToolRepository, _userRepository, _entityFactory, _tokenProvider, _eventPublisher, _releaseNoteFileReader, _unitOfWork, _secureTokenProvider, _surveyPopupVersionReader);
        }

        #region OnAuthenticate

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

        #endregion

        #region OnAuthenticated

        [TestMethod]
        public void OnAuthenticated_ShouldThrowExceptionIfConsumerToolIsNullInRequest()
        {
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns((ConsumerTool)null);
            Action action = () => _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid " + OAuthConstants.ConsumerKeyParameter);
        }

        [TestMethod]
        public void OnAuthenticated_ShouldThrowExceptionIfEmailIsNull()
        {
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(Substitute.For<ConsumerTool>());
            _ltiRequest.LisPersonEmailPrimary.Returns((string)null);
            Action action = () => _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid LisPersonEmailPrimary: Email of the user is null or white space.");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldThrowExceptionIfEmailIsWhiteSpace()
        {
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(Substitute.For<ConsumerTool>());
            _ltiRequest.LisPersonEmailPrimary.Returns("   ");
            Action action = () => _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            action.ShouldThrow<LtiException>().And.Message.Should().Be("Invalid LisPersonEmailPrimary: Email of the user is null or white space.");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldCreateUserIfItDoesNotExist()
        {
            var consumerTool = Substitute.For<ConsumerTool>();

            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Academy, user.Settings.LastReadReleaseNote, user.Settings.LastPassedSurveyPopup, DateTimeWrapper.Now().AddYears(50), true, false, null, null, true, true).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _userRepository.Received().Add(Arg.Is<User>(
                             _ => _ == user &&
                             _.GetLtiUserInfo(userId, consumerTool) != null &&
                             _.GetLtiUserInfo(userId, consumerTool).LtiUserId == userId &&
                             _.GetLtiUserInfo(userId, consumerTool).ConsumerTool == consumerTool
                        ));
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void OnAuthenticated_ShouldCreateUserIfItDoesNotExist_WithSettingsFromConsumerTool()
        {
            var consumerTool = Substitute.For<ConsumerTool>();
            var company = Substitute.For<Company>();
            var consumerToolSettings = Substitute.For<ConsumerToolSettings>();
            consumerToolSettings.Company.Returns(company);
            consumerToolSettings.AccessType.Returns(AccessType.Starter);
            consumerToolSettings.ExpirationPeriodDays.Returns(10);
            consumerTool.Settings.Returns(consumerToolSettings);

            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Starter, user.Settings.LastReadReleaseNote, user.Settings.LastPassedSurveyPopup, DateTimeWrapper.Now().AddDays(10), true, false, Arg.Any<Collection<Company>>(), null, true, true).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _userRepository.Received().Add(Arg.Is<User>(
                             _ => _ == user &&
                             _.GetLtiUserInfo(userId, consumerTool) != null &&
                             _.GetLtiUserInfo(userId, consumerTool).LtiUserId == userId &&
                             _.GetLtiUserInfo(userId, consumerTool).ConsumerTool == consumerTool
                        ));
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void OnAuthenticated_ShouldRaiseUserSignedUpEvent_IfUserDoesNotExist()
        {
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(Substitute.For<ConsumerTool>());
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Academy, user.Settings.LastReadReleaseNote, user.Settings.LastPassedSurveyPopup, DateTimeWrapper.Now().AddYears(50), true, false, Arg.Any<Collection<Company>>(), null, true, true).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _eventPublisher.Received().Publish(Arg.Is<UserSignedUpEvent>(_ => _.User == user));
        }

        [TestMethod]
        public void OnAuthenticated_ShouldRaiseEventAboutCreationInitialData_IfUserDoesNotExist()
        {
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(Substitute.For<ConsumerTool>());
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Academy, user.Settings.LastReadReleaseNote, user.Settings.LastPassedSurveyPopup, DateTimeWrapper.Now().AddYears(50), true, false, Arg.Any<Collection<Company>>(), null, true, true).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _eventPublisher.Received().Publish(Arg.Is<CreateUserInitialDataEvent>(_ => _.User == user));
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnRootUrl_IfUserExistsAndHeIsNotUserOfCurrentConsumerTool()
        {
            var consumerKey = "key";
            var consumerTool = Substitute.For<ConsumerTool>();
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _userRepository.GetUserByEmail(email).Returns(user);

            var ltiUserInfo = LtiUserInfoObjectMother.Create(userId, consumerTool, user);
            _entityFactory.LtiUserInfo(userId, consumerTool, user).Returns(ltiUserInfo);

            _secureTokenProvider.GenerateToken(Arg.Is<LtiUserInfoSecure>(_ => _.LtiUserId == userId && _.UserId == user.Id && _.ConsumerToolId == consumerTool.Id)).Returns("token");

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);
            
            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be($"{_uri.GetLeftPart(UriPartial.Authority)}#token.user.lti=token");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnRootUrl_IfUserExistsAndHeHasDiffferentUserId()
        {
            var consumerTool = Substitute.For<ConsumerTool>();
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);
            user.AddLtiUserInfo("3", consumerTool);

            var ltiUserInfo = LtiUserInfoObjectMother.Create(userId, consumerTool, user);
            _entityFactory.LtiUserInfo(userId, consumerTool, user).Returns(ltiUserInfo);

            _userRepository.GetUserByEmail(email).Returns(user);

            _secureTokenProvider.GenerateToken(Arg.Is<LtiUserInfoSecure>(_ => _.LtiUserId == userId && _.UserId == user.Id && _.ConsumerToolId == consumerTool.Id)).Returns("token");

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                 .Be($"{_uri.GetLeftPart(UriPartial.Authority)}#token.user.lti=token");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnRootUrl_IfUserExistsAndIsLtiUser_ButLtiInfoDoesNotExist()
        {
            var consumerTool = Substitute.For<ConsumerTool>();
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);
            user.AddLtiUserInfo("3", Substitute.For<ConsumerTool>());

            var ltiUserInfo = LtiUserInfoObjectMother.Create(userId, consumerTool, user);
            _entityFactory.LtiUserInfo(userId, consumerTool, user).Returns(ltiUserInfo);

            _userRepository.GetUserByEmail(email).Returns(user);

            _secureTokenProvider.GenerateToken(Arg.Is<LtiUserInfoSecure>(_ => _.LtiUserId == userId && _.UserId == user.Id && _.ConsumerToolId == consumerTool.Id)).Returns("token");

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                 .Be($"{_uri.GetLeftPart(UriPartial.Authority)}#token.user.lti=token");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldSetReturnUrlToProperValue_WhenToolUrlIsNotSpecifiedInParam_ForJustCreatedUser()
        {
            var consumerKey = "key";
            var consumerTool = Substitute.For<ConsumerTool>();
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Academy, user.Settings.LastReadReleaseNote, user.Settings.LastPassedSurveyPopup, DateTimeWrapper.Now().AddYears(50), true, false, null, null, true, true).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be($"{_uri.GetLeftPart(UriPartial.Authority)}#token.lti={authToken}");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldSetReturnUrlToProperValue_WhenToolUrlSpecifiedInParam_ForJustCreatedUser()
        {
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(Substitute.For<ConsumerTool>());
            
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);

            var customUrl = "http://localhost/";

            _ltiRequestParams.Add(easygenerator.Auth.Lti.Constants.ToolProviderUrl, customUrl);
            var user = UserObjectMother.CreateWithEmail(email);

            _entityFactory.User(email, Arg.Any<string>(), firstName, lastName, ltiMockData, ltiMockData, ltiMockData,
                email, AccessType.Academy, user.Settings.LastReadReleaseNote, user.Settings.LastPassedSurveyPopup, DateTimeWrapper.Now().AddYears(50), true, false, null, null, true, true).Returns(user);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be($"{customUrl}#token.lti={authToken}");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnRootUrl_WhenToolUrlIsNotSpecifiedInParam_ForExistingUser()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            var consumerKey = "key";
            var consumerTool = Substitute.For<ConsumerTool>();
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);

            var ltiUserInfo = LtiUserInfoObjectMother.Create(userId, consumerTool, user);
            _entityFactory.LtiUserInfo(userId, consumerTool, user).Returns(ltiUserInfo);

            user.AddLtiUserInfo("3", Substitute.For<ConsumerTool>());
            _userRepository.GetUserByEmail(email).Returns(user);

            _secureTokenProvider.GenerateToken(Arg.Is<LtiUserInfoSecure>(_ => _.LtiUserId == userId && _.UserId == user.Id && _.ConsumerToolId == consumerTool.Id)).Returns("token");

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                 .Be($"{_uri.GetLeftPart(UriPartial.Authority)}#token.user.lti=token");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldReturnRootUrl_WhenToolUrlSpecifiedInParam_ForExistingUser()
        {
            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            var consumerKey = "key";
            var consumerTool = Substitute.For<ConsumerTool>();
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);

            var ltiUserInfo = LtiUserInfoObjectMother.Create(userId, consumerTool, user);
            _entityFactory.LtiUserInfo(userId, consumerTool, user).Returns(ltiUserInfo);

            user.AddLtiUserInfo("3", Substitute.For<ConsumerTool>());
            _userRepository.GetUserByEmail(email).Returns(user);

            var customUrl = "http://localhost/";

            _ltiRequestParams.Add(easygenerator.Auth.Lti.Constants.ToolProviderUrl, customUrl);

            _secureTokenProvider.GenerateToken(Arg.Is<LtiUserInfoSecure>(_ => _.LtiUserId == userId && _.UserId == user.Id && _.ConsumerToolId == consumerTool.Id)).Returns("token");

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                 .Be($"{customUrl}#token.user.lti=token");
        }

        [TestMethod]
        public void OnAuthenticated_ShouldSetReturnUrlToProperValueWithCompanyIdInHash_WhenCurrentConsumerToolHasCompanySettings_ForAllUsers()
        {
            var consumerTool = Substitute.For<ConsumerTool>();
            var company = Substitute.For<Company>();
            var consumerToolSettings = Substitute.For<ConsumerToolSettings>();
            consumerToolSettings.Company.Returns(company);
            consumerTool.Settings.Returns(consumerToolSettings);

            _ltiRequest.LisPersonEmailPrimary.Returns(email);
            _ltiRequest.LisPersonNameGiven.Returns(firstName);
            _ltiRequest.LisPersonNameFamily.Returns(lastName);
            _ltiRequest.UserId.Returns(userId);
            var consumerKey = "key";
            _ltiRequest.ConsumerKey.Returns(consumerKey);
            _consumerToolRepository.GetByKey(consumerKey).Returns(consumerTool);

            var user = UserObjectMother.CreateWithEmail(email);
            user.AddLtiUserInfo(userId, consumerTool);
            _userRepository.GetUserByEmail(email).Returns(user);

            var customUrl = "http://localhost/";

            _ltiRequestParams.Add(Auth.Lti.Constants.ToolProviderUrl, customUrl);

            _ltiAuthProvider.OnAuthenticated(_ltiAuthenticatedContext);

            _ltiAuthenticatedContext.RedirectUrl.Should()
                .Be($"{customUrl}#token.lti={authToken}&companyId={consumerTool.Settings.Company.Id.ToString("N")}");
        }

        #endregion
    }
}
