using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IConsumerToolRepository : IRepository<ConsumerTool>
    {
        ConsumerTool GetByKey(string key);
    }
}
