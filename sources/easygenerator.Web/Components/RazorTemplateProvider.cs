using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;
using RazorEngine;
using RazorEngine.Templating;


namespace easygenerator.Web.Components
{
    public class RazorTemplateProvider
    {
        private readonly object _locker = new object();

        public virtual string Get(string razorTemplateRelativePath, dynamic templateModel)
        {
            var cacheName = GetOrAddTemplateCacheName(razorTemplateRelativePath);

            return RazorEngineServiceExtensions.RunCompile(Engine.Razor, cacheName, null, templateModel);
        }

        private ITemplateKey GetOrAddTemplateCacheName(string razorTemplateRelativePath)
        {
            string templatePath = HostingEnvironment.MapPath(razorTemplateRelativePath);
            if (templatePath == null)
                return null;

            var cacheName = Engine.Razor.GetKey(templatePath);

            if (!Engine.Razor.IsTemplateCached(cacheName, null))
            {
                lock (_locker)
                {
                    if (!Engine.Razor.IsTemplateCached(cacheName, null))
                    {
                        var content = File.ReadAllText(templatePath);
                        Engine.Razor.AddTemplate(cacheName, new LoadedTemplateSource(content, templatePath));
                    }
                }
            }
            return cacheName;
        }
    }
}