using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Components;
using System;
using System.Net.Mail;

namespace easygenerator.Web.Mail
{
    public class MailSenderWrapper : IMailSenderWrapper
    {
        private const string ForgotPasswordTemplateName = "ForgotPasswordTemplate";
        private const string InviteCollaboratorTemplateName = "InviteCollaboratorTemplate";
        private const string InviteOrganizationUserTemplateName = "InviteOrganizationUserTemplate";

        private readonly IUrlHelperWrapper _urlHelperWrapper;
        private readonly IMailSender _mailSender;
        private readonly MailSettings _senderSettings;
        private readonly IMailTemplatesProvider _mailTemplatesProvider;

        public MailSenderWrapper(IUrlHelperWrapper urlHelperWrapper, IMailSender mailSender, MailSettings senderSettings, IMailTemplatesProvider mailTemplatesProvider)
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

            var title = ViewsResources.Resources.ForgotPasswordSubject;
            var templateSettings = _senderSettings.MailTemplatesSettings[ForgotPasswordTemplateName];
            var body = _mailTemplatesProvider.GetMailTemplateBody(templateSettings, new { WebsiteUrl = websiteUrl, RestorePasswordUrl = restorePasswordUrl });

            _mailSender.Send(new MailMessage(templateSettings.From, email, _mailSender.NormalizeMailMessageSubject(title), body) { IsBodyHtml = true });
        }

        public void SendInviteCollaboratorMessage(string email, string userName, string courseTitle)
        {
            var websiteUrl = _urlHelperWrapper.RouteWebsiteUrl();
            var templateSettings = _senderSettings.MailTemplatesSettings[InviteCollaboratorTemplateName];
            var fromDisplayName = String.Format(ViewsResources.Resources.InviteCollaboratorFromDisplayName, userName);
            var mailMessage = new MailMessage(new MailAddress(templateSettings.From, fromDisplayName), new MailAddress(email))
            {
                Subject = _mailSender.NormalizeMailMessageSubject(String.Format(ViewsResources.Resources.InviteCollaboratorSubject, userName, courseTitle)),
                Body = _mailTemplatesProvider.GetMailTemplateBody(templateSettings, new { UserName = userName, WebsiteUrl = websiteUrl, Email = email }),
                IsBodyHtml = true
            };

            _mailSender.Send(mailMessage);
        }

        public void SendInviteOrganizationUserMessage(string email, string userName, string organizationTitle)
        {
            var websiteUrl = _urlHelperWrapper.RouteWebsiteUrl();
            var templateSettings = _senderSettings.MailTemplatesSettings[InviteOrganizationUserTemplateName];
            var fromDisplayName = String.Format(ViewsResources.Resources.InviteOrganizationUserFromDisplayName, userName);
            var mailMessage = new MailMessage(new MailAddress(templateSettings.From, fromDisplayName), new MailAddress(email))
            {
                Subject = _mailSender.NormalizeMailMessageSubject(String.Format(ViewsResources.Resources.InviteOrganizationUserSubject, userName, organizationTitle)),
                Body = _mailTemplatesProvider.GetMailTemplateBody(templateSettings, new { UserName = userName, WebsiteUrl = websiteUrl, Email = email, OrganizationTitle = organizationTitle }),
                IsBodyHtml = true
            };

            _mailSender.Send(mailMessage);
        }
    }
}