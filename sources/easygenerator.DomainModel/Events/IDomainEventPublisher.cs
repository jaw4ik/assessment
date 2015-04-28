namespace easygenerator.DomainModel.Events
{
    public interface IDomainEventPublisher
    {
        void Publish<T>(T args);
    }
}
