using System;
using System.Linq;
using System.Net.Http;

namespace easygenerator.PublicationServer.Constraints
{
    public class SeoFragmentRouteConstraint : CourseIdRouteConstraint
    {
        public const string SearchCrawlerEscapedFragment = "_escaped_fragment_";

        protected override bool IsMatch(HttpRequestMessage request, Guid courseId)
        {
            var queryParams = request.GetQueryNameValuePairs();
            return (queryParams != null && queryParams.Any(_ => String.Equals(_.Key, SearchCrawlerEscapedFragment, StringComparison.CurrentCultureIgnoreCase))) || ExistsInReferrer(request);
        }

        private bool ExistsInReferrer(HttpRequestMessage request)
        {
            return request.Headers?.Referrer != null && request.Headers.Referrer.ToString().Contains(SearchCrawlerEscapedFragment);
        }
    }
}


