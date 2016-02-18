using System;
using System.Text.RegularExpressions;

namespace easygenerator.PublicationServer.Utils
{
    public class SearchCrawlerDetector
    {
        private static readonly Regex SearchCrawlerAgentsRegex =
            new Regex(@"bot|crawler|baiduspider|80legs|ia_archiver|voyager|curl|wget|yahoo! slurp|mediapartners-google", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public virtual bool IsCrawler(string userAgent)
        {
            if (!string.IsNullOrWhiteSpace(userAgent))
            {
                return SearchCrawlerAgentsRegex.IsMatch(userAgent);
            }
            return false;
        }
    }
}
