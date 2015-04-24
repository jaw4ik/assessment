using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class DomainEventPublisher : IDomainEventPublisher
    {
        private readonly IDependencyResolverWrapper _dependencyResolver;

        public DomainEventPublisher(IDependencyResolverWrapper dependencyResolver)
        {
            _dependencyResolver = dependencyResolver;
        }

        public void Publish<T>(T args)
        {
            var handlersProvider = _dependencyResolver.GetService<IDomainEventHandlersProvider<T>>();

            var handlers = handlersProvider.GetHandlersForEvent();
            foreach (var domainEventHandler in handlers)
            {
                domainEventHandler.Handle(args);
            }
        }
    }
}
