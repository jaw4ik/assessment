using easygenerator.DomainEvents.Interfaces;

namespace easygenerator.DomainEvents
{
    public class DomainEventPublisher<T> : IDomainEventPublisher<T>
    {
        private readonly IDomainEventHandlersProvider<T> _handlersProvider;

        public DomainEventPublisher(IDomainEventHandlersProvider<T> handlersProvider)
        {
            _handlersProvider = handlersProvider;
        }

        public void Publish(T args)
        {
            var handlers = _handlersProvider.GetHandlersForEvent();
            foreach (var domainEventHandler in handlers)
            {
                domainEventHandler.Handle(args);
            }
        }
    }
}
