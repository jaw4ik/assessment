using System.Net.Mail;
using easygenerator.Web.Components;

namespace easygenerator.Web.Mail
{
    public interface IMailSenderWrapper
    {
        void SendForgotPasswordMessage(string email, string ticketId);
    }
    public class MailSenderWrapper : IMailSenderWrapper
    {
        private readonly IUrlHelperWrapper _urlHelperWrapper;
        private readonly IMailSender _mailSender;
        private readonly MailSettings _senderSettings;

        public MailSenderWrapper(IUrlHelperWrapper urlHelperWrapper, IMailSender mailSender, MailSettings senderSettings)
        {
            _urlHelperWrapper = urlHelperWrapper;
            _mailSender = mailSender;
            _senderSettings = senderSettings;
        }

        public void SendForgotPasswordMessage(string email, string ticketId)
        {
            const string templateName = "ForgotPasswordTemplate";
            var templateSettings = _senderSettings.MailTemplatesSettings[templateName];
            var url = _urlHelperWrapper.RouteRestorePasswordUrl(ticketId);

            const string title = "Forgot password";
            var body = MailTemplatesProvider.GetMailTemplateBody(templateName, templateSettings, new { Url = url });
            _mailSender.Send(new MailMessage(templateSettings.From, email, title, body) { IsBodyHtml = true });
        }

    }
}