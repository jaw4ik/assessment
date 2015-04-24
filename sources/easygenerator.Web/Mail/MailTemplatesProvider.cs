using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Mail
{
    public class MailTemplatesProvider : IMailTemplatesProvider
    {
        private const string TemplateLocation = "~/Mail/MailTemplates/{0}.cshtml";
        private readonly RazorTemplateProvider _razorTemplateProvider;

        public MailTemplatesProvider(RazorTemplateProvider razorTemplateProvider)
        {
            _razorTemplateProvider = razorTemplateProvider;
        }

        public string GetMailTemplateBody(IMailTemplate templateOptions, dynamic templateModel)
        {
            return _razorTemplateProvider.Get(GetMailTemplatePath(templateOptions), templateModel);
        }

        private string GetMailTemplatePath(IMailTemplate templateOptions)
        {
            return string.IsNullOrEmpty(templateOptions.ViewPath)
                ? string.Format(TemplateLocation, templateOptions.Name)
                : templateOptions.ViewPath;
        }
    }
}
