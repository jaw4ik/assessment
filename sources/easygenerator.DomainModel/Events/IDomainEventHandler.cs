namespace easygenerator.DomainModel.Events
{
    public interface IDomainEventHandler<T>
    {
        void Handle(T args);
    }
}
