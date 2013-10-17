using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class HelpHintRepository : Repository<HelpHint>, IHelpHintRepository
    {
        private readonly IEntityFactory _entityFactory;

        public HelpHintRepository(IDataContext dataContext, IEntityFactory entityFactory)
            : base(dataContext)
        {
            _entityFactory = entityFactory;
        }

        public ICollection<HelpHint> GetHelpHintsForUser(string user)
        {
            return _dataContext.GetSet<HelpHint>().Where(hint => hint.CreatedBy == user).ToList();
        }

        public void CreateHelpHintsForUser(string user)
        {
            foreach (string allowedHintKey in HelpHint.AllowedHintKeys)
            {
                _dataContext.GetSet<HelpHint>().Add(_entityFactory.HelpHint(allowedHintKey, user));
            }
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
