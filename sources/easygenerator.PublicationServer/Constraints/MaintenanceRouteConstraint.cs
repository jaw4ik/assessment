using System.Collections.Generic;
using System.Web.Http.Routing;
using easygenerator.PublicationServer.Publish;

namespace easygenerator.PublicationServer.Constraints
{
    public class MaintenanceRouteConstraint : IHttpRouteConstraint
    {
        private readonly IPublishDispatcher _publishDispatcher;

        public MaintenanceRouteConstraint(IPublishDispatcher publishDispatcher)
        {
            _publishDispatcher = publishDispatcher;
        }

        public bool Match(System.Net.Http.HttpRequestMessage request, IHttpRoute route, string parameterName, IDictionary<string, object> values, HttpRouteDirection routeDirection)
        {
            if (values.ContainsKey(parameterName))
            {
                object courseIdObj;
                if (values.TryGetValue(parameterName, out courseIdObj))
                {
                    if (courseIdObj != null)
                        return _publishDispatcher.IsPublishing(courseIdObj.ToString());
                }
            };

            return false;
        }
    }
}
