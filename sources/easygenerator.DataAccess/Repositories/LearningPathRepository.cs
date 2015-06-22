using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class LearningPathRepository : Repository<LearningPath>, ILearningPathRepository
    {
        public LearningPathRepository(IDataContext dataContext) : base(dataContext)
        {
        }
    }
}
