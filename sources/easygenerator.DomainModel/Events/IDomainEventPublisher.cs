namespace easygenerator.DomainModel.Events
{
    public interface IDomainEventPublisher<T>
    {
        void Publish(T args);
    }
}
