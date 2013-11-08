using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components
{
    public class CultureInitialization
    {
        public static void Initialize(string[] userLanguages)
        {
            var defaultCulture = new CultureInfo(Constants.DefaultCulture);
            if (userLanguages != null && userLanguages.Length > 0)
            {
                foreach (var userLanguage in userLanguages)
                {
                    var language = GetCorrectCulture(userLanguage.Split(';')[0]);
                    if (Constants.SupportedCultures.Any(supportedCulture => language == supportedCulture))
                    {
                        var culture = new CultureInfo(language);
                        Thread.CurrentThread.CurrentUICulture = culture;
                        Thread.CurrentThread.CurrentCulture = culture;
                        return;
                    }
                }
            }
            Thread.CurrentThread.CurrentCulture = defaultCulture;
        }

        private static string GetCorrectCulture(string culture)
        {
            return Constants.NumericCulturesMapping.SingleOrDefault(i => i.Key == culture).Value ?? culture;
        }
    }
}