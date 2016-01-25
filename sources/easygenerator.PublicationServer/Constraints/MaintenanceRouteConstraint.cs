using System;
using System.Collections.Generic;
using System.Net.Http;
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

        public bool Match(HttpRequestMessage request, IHttpRoute route, string parameterName, IDictionary<string, object> values, HttpRouteDirection routeDirection)
        {
            if (values.ContainsKey(parameterName))
            {
                object courseIdObj;
                if (values.TryGetValue(parameterName, out courseIdObj) && courseIdObj != null)
                {
                    Guid courseId;
                    if (Guid.TryParse(courseIdObj.ToString(), out courseId))
                    {
                        return _publishDispatcher.IsPublishing(courseId);
                    }
                }
            }
            return false;
        }
    }
}
