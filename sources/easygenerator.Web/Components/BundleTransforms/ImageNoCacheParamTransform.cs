using System;
using System.Text.RegularExpressions;
using System.Web.Optimization;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.BundleTransforms
{
    public class ImageNoCacheParamTransform : IBundleTransform
    {
        public void Process(BundleContext context, BundleResponse response)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }
            if (response == null)
            {
                throw new ArgumentNullException("response");
            }
            if (!context.EnableInstrumentation)
            {
                String extentions = @"\.(jpeg|jpg|png|gif)";
                String version = "?v=" + DateTimeWrapper.InstanceStartTime.Ticks;
                var regex = new Regex(extentions, RegexOptions.IgnoreCase);
                var result = regex.Replace(response.Content, m => m.Value + version);
                response.Content = result;
            }
        }
    }
}