using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using RazorEngine;
using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;

namespace easygenerator.Web.Mail
{
    public class MailTemplatesProvider
    {
        private const string TemplateLocation = "~/Mail/MailTemplates/{0}.cshtml";
        private readonly RazorTemplateProvider _razorTemplateProvider;

        public MailTemplatesProvider(RazorTemplateProvider razorTemplateProvider)
        {
            _razorTemplateProvider = razorTemplateProvider;
        }

        public string GetMailTemplateBody(MailTemplate templateOptions, dynamic templateModel)
        {
            return _razorTemplateProvider.Get(GetMailTemplatePath(templateOptions), templateModel);
        }

        private string GetMailTemplatePath(MailTemplate templateOptions)
        {
            return string.IsNullOrEmpty(templateOptions.ViewPath)
                ? string.Format(TemplateLocation, templateOptions.Name)
                : templateOptions.ViewPath;
        }
    }
}
