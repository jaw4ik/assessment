using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration.MailSender;
using easygenerator.Web.Mail;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using easygenerator.Infrastructure.Mail;

namespace easygenerator.Web.Tests.Mail
{
    [TestClass]
    public class MailTemplatesProviderTests
    {
        private IMailTemplatesProvider _mailTemplatesProvider;
        private RazorTemplateProvider _razorTemplateProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _razorTemplateProvider = Substitute.For<RazorTemplateProvider>();
            _mailTemplatesProvider = new MailTemplatesProvider(_razorTemplateProvider);
        }

        #region GetMailTemplateBody

        [TestMethod]
        public void GetMailTemplateBody_ShouldGetRazorTemplateWithDefaultPath_WhenOptionsViewPathIsEmpty()
        {
            //Arrange
            var model = new object();
            var mailTemplate = new MailTemplate()
                {
                    Name = "MailTemplate",
                    ViewPath = String.Empty
                };

            //Act
            _mailTemplatesProvider.GetMailTemplateBody(mailTemplate, model);

            //Assert
            _razorTemplateProvider.Received().Get(String.Format("~/Mail/MailTemplates/{0}.cshtml", mailTemplate.Name), model);
        }

        [TestMethod]
        public void GetMailTemplateBody_ShouldGetRazorTemplateWithOptionsViewPath_WhenOptionsViewPathIsDefined()
        {
            //Arrange
            var model = new Object();
            var mailTemplate = new MailTemplate()
            {
                Name = "MailTemplate",
                ViewPath = "somePath"
            };

            //Act
            _mailTemplatesProvider.GetMailTemplateBody(mailTemplate, model);

            //Assert
            _razorTemplateProvider.Received().Get(mailTemplate.ViewPath, model);
        }

        [TestMethod]
        public void GetMailTemplateBody_ShouldReturnRazorTemplate()
        {
            //Arrange
            const string razorTemplate = "razorTemplate";
            _razorTemplateProvider.Get(Arg.Any<string>(), Arg.Any<object>()).Returns(razorTemplate);

            //Act
            var result = _mailTemplatesProvider.GetMailTemplateBody(new MailTemplate(), new Object());

            //Assert
            Assert.AreEqual(result, razorTemplate);
        }

        #endregion
    }
}
