using System;
using System.Web.Http.Dependencies;
using System.Web.Http.Routing;

namespace easygenerator.PublicationServer.Constraints
{
    public class InlineConstraintResolver : DefaultInlineConstraintResolver
    {
        private readonly IDependencyResolver _dependencyResolver;

        public InlineConstraintResolver(IDependencyResolver dependencyResolver)
        {
            _dependencyResolver = dependencyResolver;
        }

        public override IHttpRouteConstraint ResolveConstraint(string inlineConstraint)
        {
            Type constraintType;
            if (ConstraintMap.TryGetValue(inlineConstraint, out constraintType))
            {
                var constraint = _dependencyResolver.GetService(constraintType) as IHttpRouteConstraint;
                if (constraint != null)
                {
                    return constraint;
                }
            }
            return base.ResolveConstraint(inlineConstraint);
        }
    }
}
