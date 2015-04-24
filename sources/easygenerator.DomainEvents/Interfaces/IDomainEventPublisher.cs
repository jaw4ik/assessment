namespace easygenerator.DomainEvents.Interfaces
{
    public interface IDomainEventPublisher<T>
    {
        void Publish(T args);
    }
}
