using System;
using System.Net.Mail;
using AccountRes;
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
        private readonly MailTemplatesProvider _mailTemplatesProvider;

        public MailSenderWrapper(IUrlHelperWrapper urlHelperWrapper, IMailSender mailSender, MailSettings senderSettings, MailTemplatesProvider mailTemplatesProvider)
        {
            _urlHelperWrapper = urlHelperWrapper;
            _mailSender = mailSender;
            _senderSettings = senderSettings;
            _mailTemplatesProvider = mailTemplatesProvider;
        }

        public void SendForgotPasswordMessage(string email, string ticketId)
        {
            var restorePasswordUrl = _urlHelperWrapper.RouteRestorePasswordUrl(ticketId);
            var websiteUrl = _urlHelperWrapper.RouteWebsiteUrl();

            var title = String.Format(Resources.ForgotPasswordSubject, websiteUrl);

            const string templateName = "ForgotPasswordTemplate";
            var templateSettings = _senderSettings.MailTemplatesSettings[templateName];
            var body = _mailTemplatesProvider.GetMailTemplateBody(templateName, templateSettings, new { WebsiteUrl = websiteUrl, RestorePasswordUrl = restorePasswordUrl });

            _mailSender.Send(new MailMessage(templateSettings.From, email, title, body) { IsBodyHtml = true });
        }

    }
}