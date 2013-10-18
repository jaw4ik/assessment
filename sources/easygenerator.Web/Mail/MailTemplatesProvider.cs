using easygenerator.Web.Components.Configuration;
using RazorEngine;
using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;

namespace easygenerator.Web.Mail
{
    internal static class MailTemplatesProvider
    {
        private const string TemplateLocation = "~/Mail/MailTemplates/{0}.cshtml";
        private static readonly Dictionary<string, string> _mailTemplatesCache = new Dictionary<string, string>();
        private static readonly object _locker = new object();

        internal static string GetMailTemplateBody(string templateName, MailTemplate templateOptions, dynamic templateModel)
        {
            var template = GetMailTemplateContent(templateName, templateOptions);
            var body = Razor.Parse(template, templateModel);
            return body;
        }

        private static string GetMailTemplateContent(string templateName, MailTemplate templateOptions)
        {
            string templatePath = GetMailTemplatePath(templateOptions);
            if (_mailTemplatesCache.ContainsKey(templateName))
            {
                return _mailTemplatesCache[templateName];
            }

            lock (_locker)
            {
                if (!_mailTemplatesCache.ContainsKey(templateName))
                {
                    string content = File.ReadAllText(templatePath);
                    _mailTemplatesCache[templateName] = content;
                }
                return _mailTemplatesCache[templateName];
            }
        }

        private static string GetMailTemplatePath(MailTemplate templateOptions)
        {
            string templatePath = string.IsNullOrEmpty(templateOptions.ViewPath)
                ? string.Format(TemplateLocation, templateOptions.Name)
                : templateOptions.ViewPath;
            return HostingEnvironment.MapPath(templatePath);
        }
    }
}
