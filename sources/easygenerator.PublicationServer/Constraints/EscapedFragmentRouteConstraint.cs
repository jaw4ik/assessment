using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Routing;

namespace easygenerator.PublicationServer.Constraints
{
    public class EscapedFragmentRouteConstraint : IHttpRouteConstraint
    {
        public const string SearchCrawlerEscapedFragment = "_escaped_fragment_";

        public bool Match(HttpRequestMessage request, IHttpRoute route, string parameterName, IDictionary<string, object> values, HttpRouteDirection routeDirection)
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


