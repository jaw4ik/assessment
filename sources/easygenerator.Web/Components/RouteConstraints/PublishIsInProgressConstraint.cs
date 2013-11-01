using easygenerator.Web.Publish;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace easygenerator.Web.Components.RouteConstraints
{
    public class PublishIsInProgressConstraint : IRouteConstraint
    {
        private readonly IPublishDispatcher _publishDispatcher;
        public PublishIsInProgressConstraint(IPublishDispatcher publishDispatcher)
        {
            _publishDispatcher = publishDispatcher;
        }

        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
        {
            if (values.ContainsKey(parameterName))
            {
                object experieceIdObj;
                if (values.TryGetValue(parameterName, out experieceIdObj))
                {
                    if (experieceIdObj != null)
                        return _publishDispatcher.IsPublishing(experieceIdObj.ToString());
                }
            };

            return false;
        }
    }
}