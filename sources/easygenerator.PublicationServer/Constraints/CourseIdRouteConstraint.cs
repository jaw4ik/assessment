using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http.Routing;

namespace easygenerator.PublicationServer.Constraints
{
    public abstract class CourseIdRouteConstraint : IHttpRouteConstraint
    {
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
                        return IsMatch(request, courseId);
                    }
                }
            }
            return false;
        }

        protected abstract bool IsMatch(HttpRequestMessage request, Guid courseId);
    }
}
