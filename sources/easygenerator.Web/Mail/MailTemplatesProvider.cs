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
        private RazorTemplateProvider _razorTemplateProvider;

        public MailTemplatesProvider(RazorTemplateProvider razorTemplateProvider)
        {
            _razorTemplateProvider = razorTemplateProvider;
        }

        public string GetMailTemplateBody(string templateName, MailTemplate templateOptions, dynamic templateModel)
        {
            return _razorTemplateProvider.Get(GetMailTemplatePath(templateOptions), templateModel);
        }

        private string GetMailTemplatePath(MailTemplate templateOptions)
        {
            string templatePath = string.IsNullOrEmpty(templateOptions.ViewPath)
                ? string.Format(TemplateLocation, templateOptions.Name)
                : templateOptions.ViewPath;
            return HostingEnvironment.MapPath(templatePath);
        }
    }
}
