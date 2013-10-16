using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.DataAccess.Repositories
{
    public class HelpHintRepository : Repository<HelpHint>, IHelpHintRepository
    {
        private readonly IDataContext _dataContext;
        private readonly IEntityFactory _entityFactory;

        public HelpHintRepository(IDataContext dataContext, IEntityFactory entityFactory)
            : base(dataContext)
        {
            _dataContext = dataContext;
            _entityFactory = entityFactory;
        }

        public ICollection<HelpHint> GetHelpHintsForUser(string user)
        {
            return _dataContext.GetSet<HelpHint>().Where(hint => hint.CreatedBy == user).ToList();
        }

        public void CreateHelpHintsForUser(string user)
        {
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.ExperiencesHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.ExperienceHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.CreateExperienceHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.LearningObjectivesHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.LearningObjectiveHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.CreateLearningObjectiveHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.QuestionHelpHintKey, user));
            _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(Constants.HelpHintNames.CreateQuestionHelpHintKey, user));
        }

        public void ShowHint(HelpHint hint)
        {
            _dataContext.GetSet<HelpHint>().Add(hint);
        }

        public void HideHint(HelpHint hint)
        {
            _dataContext.GetSet<HelpHint>().Remove(hint);
        }
    }
}
