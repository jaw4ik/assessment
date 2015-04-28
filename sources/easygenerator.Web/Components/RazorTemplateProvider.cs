using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using RazorEngine;

namespace easygenerator.Web.Components
{
    public class RazorTemplateProvider
    {
        private readonly Dictionary<string, string> _templatesCache = new Dictionary<string, string>();
        private readonly object _locker = new object();

        public virtual string Get(string razorTemplateRelativePath, dynamic templateModel)
        {
            var template = GetTemplateContent(razorTemplateRelativePath);
            return Razor.Parse(template, templateModel);
        }

        private string GetTemplateContent(string razorTemplateRelativePath)
        {
            string templatePath = HostingEnvironment.MapPath(razorTemplateRelativePath);
            if (templatePath == null)
                return null;

            if (_templatesCache.ContainsKey(templatePath))
            {
                return _templatesCache[templatePath];
            }

            lock (_locker)
            {
                if (!_templatesCache.ContainsKey(templatePath))
                {
                    var content = File.ReadAllText(templatePath);
                    _templatesCache[templatePath] = content;
                }
                return _templatesCache[templatePath];
            }
        }
    }
}