using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http.Routing;
using easygenerator.PublicationServer.Search;

namespace easygenerator.PublicationServer.Constraints
{
    public class SearchCrawlerRouteConstraint : IHttpRouteConstraint
    {
        private readonly SearchCrawlerDetector _searchCrawlerDetector;

        public SearchCrawlerRouteConstraint(SearchCrawlerDetector searchCrawlerDetector)
        {
            _searchCrawlerDetector = searchCrawlerDetector;
        }

        public bool Match(HttpRequestMessage request, IHttpRoute route, string parameterName, IDictionary<string, object> values, HttpRouteDirection routeDirection)
        {
            return _searchCrawlerDetector.IsCrawler(request.Headers?.UserAgent?.ToString());
        }
    }
}


