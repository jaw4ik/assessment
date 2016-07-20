using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.IdentityModel.Metadata;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Auth.Models;
using easygenerator.Auth.Providers;
using easygenerator.Auth.Security.Models;
using easygenerator.Auth.Security.Providers;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.SAML.ServiceProvider;
using easygenerator.Web.SAML.ServiceProvider.Providers;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.WebSso;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;

namespace easygenerator.Web.Tests.Controllers.SAML.ServiceProvider
{
    [TestClass]
    public class ServiceProviderControllerTests
    {
        private IPrincipal _user;
        private HttpContextBase _context;
        private ICommandProvider _commandProvider;
        private ICommandRunner _commandRunner;
        private ISignInCommandRunner _signInCommandRunner;
        private IOptionsProvider _optionsProvider;
        private IUserRepository _userRepository;
        private ISamlIdentityProviderRepository _samlIdentityProviderRepository;
        private IEntityFactory _entityFactory;
        private ITokenProvider _tokenProvider;
        private IDomainEventPublisher _domainEventPublisher;
        private IReleaseNoteFileReader _releaseNoteFileReader;
        private ISecureTokenProvider<ISecure<SamlIdPUserInfo>> _secureTokenProvider;
        private ServiceProviderController _controller;

        private IOptions _options;
        private ICommand _command;
        private HttpRequestBase _request;

        private const string SamlMockData = "SAML";

        [TestInitialize]
        public void InitializeContext()
        {
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _commandProvider = Substitute.For<ICommandProvider>();
            _commandRunner = Substitute.For<ICommandRunner>();
            _signInCommandRunner = Substitute.For<ISignInCommandRunner>();
            _optionsProvider = Substitute.For<IOptionsProvider>();
            _userRepository = Substitute.For<IUserRepository>();
            _samlIdentityProviderRepository = Substitute.For<ISamlIdentityProviderRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _tokenProvider = Substitute.For<ITokenProvider>();
            _domainEventPublisher = Substitute.For<IDomainEventPublisher>();
            _releaseNoteFileReader = Substitute.For<IReleaseNoteFileReader>();
            _secureTokenProvider = Substitute.For<ISecureTokenProvider<ISecure<SamlIdPUserInfo>>>();
            _controller = new ServiceProviderController(_commandProvider, _commandRunner, _signInCommandRunner, _optionsProvider, _userRepository,
                _samlIdentityProviderRepository, _entityFactory, _tokenProvider, _domainEventPublisher, _releaseNoteFileReader, _secureTokenProvider);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);

            _options = Substitute.For<IOptions>();
            _command = Substitute.For<ICommand>();
            _request = Substitute.For<HttpRequestBase>();
        }

        #region Index

        [TestMethod]
        public void Index_ShouldThrowIfResultIsNullOrHandled()
        {
            _context.Request.Returns(_request);
            _optionsProvider.Options.Returns(_options);
            _commandProvider.GetMetadataCommand().Returns(_command);
            _commandRunner.Run(_command, _request, _options).ReturnsNull();

            Action action = () => _controller.Index();
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("result");
        }

        [TestMethod]
        public void Index_ShouldReturnActionResultIfResultIsCorrect()
        {
            var commandResult = new CommandResult()
            {
                ContentType = "application/json",
                Content = "{ \"id\": \"2\" }"
            };
            _context.Request.Returns(_request);
            _optionsProvider.Options.Returns(_options);
            _commandProvider.GetMetadataCommand().Returns(_command);
            _commandRunner.Run(_command, _request, _options).Returns(commandResult);

            var result = _controller.Index();
            result.Should().NotBeNull();
        }

        #endregion

        #region Login

        [TestMethod]
        public void Login_ShouldThrowIfIdpIsNotFound()
        {
            const string name = "idP";
            _samlIdentityProviderRepository.GetByName(name).ReturnsNull();

            Action action = () => _controller.Login(name);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("samlIdp");
        }

        [TestMethod]
        public void Login_ShouldReturnRedirectResultIfIdpIsFound()
        {
            const string name = "idP";
            var idP = new SamlIdentityProvider(name, "http://localhost:666/saml/idp", "http://localhost:666/saml/Auth", null, 1, null, true, null, false, "cert");
            _samlIdentityProviderRepository.GetByName(name).Returns(idP);

            var result = _controller.Login(name);
            ActionResultAssert.IsRedirectToActionResult(result, "SignIn");
        }

        #endregion

        #region SignIn

        [TestMethod]
        public void SignIn_ShouldThrowIfIdpIsNotFound()
        {
            var queryStr = new NameValueCollection();
            queryStr.Add("idp", "");
            _request.QueryString.Returns(queryStr);
            _context.Request.Returns(_request);

            Action action = () => _controller.SignIn();
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("idp");
        }

        [TestMethod]
        public void SignIn_ShouldThrowIfResultIsNullOrHandled()
        {
            var queryStr = new NameValueCollection();
            queryStr.Add("idp", "http://localhost:666/saml/idp");
            _request.QueryString.Returns(queryStr);
            _context.Request.Returns(_request);
            _optionsProvider.Options.Returns(_options);
            _signInCommandRunner.Run(Arg.Is<EntityId>(e => e.Id == "http://localhost:666/saml/idp"), null, _context.Request, _options).ReturnsNull();

            Action action = () => _controller.SignIn();
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("result");
        }

        [TestMethod]
        public void SignIn_ShouldApplyCookiesIfResultIsCorrect()
        {
            var response = Substitute.For<HttpResponseBase>();
            var commandResult = new CommandResult()
            {
                ContentType = "application/json",
                Content = "{ \"id\": \"2\" }"
            };
            var queryStr = new NameValueCollection();
            queryStr.Add("idp", "http://localhost:666/saml/idp");
            _request.QueryString.Returns(queryStr);
            _context.Request.Returns(_request);
            _context.Response.Returns(response);
            _optionsProvider.Options.Returns(_options);
            _signInCommandRunner.Run(Arg.Is<EntityId>(e => e.Id == "http://localhost:666/saml/idp"), null, _context.Request, _options).Returns(commandResult);
            _controller.SignIn();
        }

        [TestMethod]
        public void SignIn_ShouldReturnActionResult()
        {
            var response = Substitute.For<HttpResponseBase>();
            var commandResult = Substitute.For<CommandResult>();

            var queryStr = new NameValueCollection();
            queryStr.Add("idp", "http://localhost:666/saml/idp");
            _request.QueryString.Returns(queryStr);
            _context.Request.Returns(_request);
            _context.Response.Returns(response);
            _optionsProvider.Options.Returns(_options);

            _signInCommandRunner.Run(Arg.Is<EntityId>(e => e.Id == "http://localhost:666/saml/idp"), null, _context.Request, _options).Returns(commandResult);
            var res = _controller.SignIn();
            res.Should().NotBeNull();
        }

        #endregion

        #region Acs

        [TestMethod]
        public void Acs_ShouldThrowIfResultIsNullOrHandled()
        {
            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _commandRunner.Run(_command, _request, _options).ReturnsNull();
            Action action = () => _controller.Acs();
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("result");
        }

        [TestMethod]
        public void Acs_ShouldThrowIfEmailIsNullOrEmpty()
        {
            var claim = new Claim(ClaimTypes.NameIdentifier, "");
            var result = Substitute.For<CommandResult>();
            result.Principal = Substitute.For<ClaimsPrincipal>();
            result.Principal.FindFirst(Arg.Any<Predicate<Claim>>())
                .Returns(claim);
            
            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _commandRunner.Run(_command, _request, _options).Returns(result);
            Action action = () => _controller.Acs();
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void Acs_ShouldThrowIfSamlIdPIsNotFound()
        {
            var claim = new Claim(ClaimTypes.NameIdentifier, "r@p.com");
            var result = Substitute.For<CommandResult>();
            result.Principal = Substitute.For<ClaimsPrincipal>();
            result.Principal.FindFirst(Arg.Any<Predicate<Claim>>())
                .Returns(claim);

            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _samlIdentityProviderRepository.GetByEntityId(Arg.Any<string>()).ReturnsNull();
            _commandRunner.Run(_command, _request, _options).Returns(result);
            Action action = () => _controller.Acs();
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("samlIdP");
        }

        [TestMethod]
        public void Acs_WhenUserDoesNotExist_ShouldThrowIfFirstNameIsNullOrEmpty()
        {
            var nameIdClaim = new Claim(ClaimTypes.NameIdentifier, "r@p.com");
            var firstNameClaim = new Claim(ClaimTypes.GivenName, "");

            var result = Substitute.For<CommandResult>();
            result.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Collection<Claim>()
            {
                nameIdClaim,
                firstNameClaim
            }));

            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _samlIdentityProviderRepository.GetByEntityId(Arg.Any<string>()).Returns(Substitute.For<SamlIdentityProvider>());
            _commandRunner.Run(_command, _request, _options).Returns(result);
            Action action = () => _controller.Acs();
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("firstName");
        }

        [TestMethod]
        public void Acs_WhenUserDoesNotExist_ShouldThrowIfLastNameIsNullOrEmpty()
        {
            var nameIdClaim = new Claim(ClaimTypes.NameIdentifier, "r@p.com");
            var firstNameClaim = new Claim(ClaimTypes.GivenName, "Roman");
            var lastNameClaim = new Claim(ClaimTypes.Surname, "");

            var result = Substitute.For<CommandResult>();
            result.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Collection<Claim>()
            {
                nameIdClaim,
                firstNameClaim,
                lastNameClaim
            }));

            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _samlIdentityProviderRepository.GetByEntityId(Arg.Any<string>()).Returns(Substitute.For<SamlIdentityProvider>());
            _commandRunner.Run(_command, _request, _options).Returns(result);
            Action action = () => _controller.Acs();
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("lastName");
        }

        [TestMethod]
        public void Acs_WhenUserDoesNotExist_ShouldCreateNewUserIfArgsAreCorrectAndReturnRedirectResult()
        {
            const string name = "idP";
            var idP = new SamlIdentityProvider(name, "http://localhost:666/saml/idp", "http://localhost:666/saml/Auth",
                null, 1, null, true, null, false, "cert");

            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail("r@p.com").ReturnsNull();

            var token = Substitute.For<TokenModel>();
            token.Token = "token";

            _tokenProvider.GenerateTokens("r@p.com", Arg.Any<string>(), Arg.Any<IEnumerable<string>>(),
                Arg.Any<DateTime>()).Returns(new List<TokenModel>()
                {
                    token
                });

            var nameIdClaim = new Claim(ClaimTypes.NameIdentifier, "r@p.com");
            var firstNameClaim = new Claim(ClaimTypes.GivenName, "Roman");
            var lastNameClaim = new Claim(ClaimTypes.Surname, "Petriv");

            var result = Substitute.For<CommandResult>();
            result.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Collection<Claim>()
            {
                nameIdClaim,
                firstNameClaim,
                lastNameClaim
            }));
            result.Location = new Uri("http://localhost:666/saml/idp");

            _request.Url.Returns(new Uri("http://localhost:666/saml/idp"));
            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _samlIdentityProviderRepository.GetByEntityId(Arg.Any<string>()).Returns(idP);
            _commandRunner.Run(_command, _request, _options).Returns(result);

            _entityFactory.User("r@p.com", Arg.Any<string>(), "Roman", "Petriv", SamlMockData, SamlMockData,
                SamlMockData,
                "r@p.com", AccessType.Trial, Arg.Any<string>(), Arg.Any<DateTime>(), false, true, null, null)
                .Returns(user);

            var res = _controller.Acs();

            _userRepository.Received().Add(user);
            _domainEventPublisher.Received().Publish(Arg.Any<UserSignedUpEvent>());
            _domainEventPublisher.Received().Publish(Arg.Any<CreateUserInitialDataEvent>());

            ActionResultAssert.IsRedirectResult(res, $"{result.Location.OriginalString}#token.samlAuth={token.Token}");
        }

        [TestMethod]
        public void Acs_WhenUserExists_AndSamlIdPUserInfoIsNull_ShouldRedirectWithSamlToken()
        {
            const string name = "idP";
            var idP = new SamlIdentityProvider(name, "http://localhost:666/saml/idp", "http://localhost:666/saml/Auth",
                null, 1, null, true, null, false, "cert");

            var user = UserObjectMother.CreateWithEmail("r@p.com");
            _userRepository.GetUserByEmail("r@p.com").Returns(user);

            var userInfo = SamlIdPUserInfoObjectMother.Create(idP, user);
            _entityFactory.SamlIdPUserInfo(idP, user).Returns(userInfo);

            _secureTokenProvider.GenerateToken(Arg.Any<ISecure<SamlIdPUserInfo>>()).Returns("token");

            var nameIdClaim = new Claim(ClaimTypes.NameIdentifier, "r@p.com");
            var firstNameClaim = new Claim(ClaimTypes.GivenName, "Roman");
            var lastNameClaim = new Claim(ClaimTypes.Surname, "Petriv");

            var result = Substitute.For<CommandResult>();
            result.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Collection<Claim>()
            {
                nameIdClaim,
                firstNameClaim,
                lastNameClaim
            }));
            result.Location = new Uri("http://localhost:666/saml/idp");

            _request.Url.Returns(new Uri("http://localhost:666/saml/idp"));
            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _samlIdentityProviderRepository.GetByEntityId(Arg.Any<string>()).Returns(idP);
            _commandRunner.Run(_command, _request, _options).Returns(result);

            var res = _controller.Acs();

            ActionResultAssert.IsRedirectResult(res, $"{result.Location.OriginalString}#token.user.saml=token");
        }

        [TestMethod]
        public void Acs_WhenUserExists_AndSamlIdPUserInfoIsNotNull_ShouldRedirectWithSamlAuthToken()
        {
            const string name = "idP";
            var idP = new SamlIdentityProvider(name, "http://localhost:666/saml/idp", "http://localhost:666/saml/Auth",
                null, 1, null, true, null, false, "cert");

            var user = UserObjectMother.CreateWithEmail("r@p.com");
            var userInfo = SamlIdPUserInfoObjectMother.Create(idP, user);
            user.AddSamlIdPUserInfo(userInfo);
            _userRepository.GetUserByEmail("r@p.com").Returns(user);

            var token = Substitute.For<TokenModel>();
            token.Token = "token";

            _tokenProvider.GenerateTokens("r@p.com", Arg.Any<string>(), Arg.Any<IEnumerable<string>>(),
                Arg.Any<DateTime>()).Returns(new List<TokenModel>()
                {
                    token
                });

            var nameIdClaim = new Claim(ClaimTypes.NameIdentifier, "r@p.com");
            var firstNameClaim = new Claim(ClaimTypes.GivenName, "Roman");
            var lastNameClaim = new Claim(ClaimTypes.Surname, "Petriv");

            var result = Substitute.For<CommandResult>();
            result.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Collection<Claim>()
            {
                nameIdClaim,
                firstNameClaim,
                lastNameClaim
            }));
            result.Location = new Uri("http://localhost:666/saml/idp");

            _request.Url.Returns(new Uri("http://localhost:666/saml/idp"));
            _context.Request.Returns(_request);
            _commandProvider.GetAcsCommand().Returns(_command);
            _optionsProvider.Options.Returns(_options);
            _samlIdentityProviderRepository.GetByEntityId(Arg.Any<string>()).Returns(idP);
            _commandRunner.Run(_command, _request, _options).Returns(result);

            var res = _controller.Acs();

            ActionResultAssert.IsRedirectResult(res, $"{result.Location.OriginalString}#token.samlAuth={token.Token}");
        }

        #endregion
    }
}
