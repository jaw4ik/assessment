using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IHelpHintRepository : IQuerableRepository<HelpHint>
    {
        ICollection<HelpHint> GetHelpHintsForUser(string user);
        void CreateHelpHintsForUser(string user);
        void ShowHint(HelpHint hint);
        void HideHint(HelpHint hint);
    }
}
