using System;
using System.Net.Http;
using easygenerator.PublicationServer.Publish;

namespace easygenerator.PublicationServer.Constraints
{
    public class MaintenanceRouteConstraint : CourseIdRouteConstraint
    {
        private readonly IPublishDispatcher _publishDispatcher;

        public MaintenanceRouteConstraint(IPublishDispatcher publishDispatcher)
        {
            _publishDispatcher = publishDispatcher;
        }

        protected override bool IsMatch(HttpRequestMessage request, Guid courseId)
        {
            return _publishDispatcher.IsPublishing(courseId);
        }
    }
}
