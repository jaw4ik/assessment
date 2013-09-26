using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public interface IDataContext
    {
        ICollection<Objective> Objectives { get; }
        ICollection<Experience> Experiences { get; }
        ICollection<Template> Templates { get; }

        void Save();
    }
}
