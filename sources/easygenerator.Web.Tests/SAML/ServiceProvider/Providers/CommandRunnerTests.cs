using System.Web;
using easygenerator.Web.SAML.ServiceProvider.Providers;
using FluentAssertions;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.WebSso;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.SAML.ServiceProvider.Providers
{
    [TestClass]
    public class CommandRunnerTests
    {
        private ICommand _command;
        private HttpRequestBase _httpRequestBase;
        private IOptions _options;
        private CommandResult _commandResult;
        private ICommandRunner _commandRunner;

        [TestInitialize]
        public void InitializeContext()
        {
            _httpRequestBase = new HttpRequestWrapper(new HttpRequest("", "http://localhost:666/saml/idp", ""));
            _options = Substitute.For<IOptions>();
            _command = Substitute.For<ICommand>();
            _commandResult = new CommandResult();
            _command.Run(Arg.Any<HttpRequestData>(), _options).Returns(_commandResult);
            _commandRunner = new CommandRunner();
        }

        [TestMethod]
        public void Run_ShouldReturnAppropriateCommandResult()
        {
            var result = _commandRunner.Run(_command, _httpRequestBase, _options);
            _command.Received().Run(Arg.Any<HttpRequestData>(), _options);
            result.Should().Be(_commandResult);
        }
    }
}
