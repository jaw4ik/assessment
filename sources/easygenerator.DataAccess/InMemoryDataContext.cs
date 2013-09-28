using System.Collections.Generic;
using System.Collections.ObjectModel;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public class InMemoryDataContext : IDataContext
    {
        public InMemoryDataContext()
        {
            Objectives = new Collection<Objective>();
            Experiences = new Collection<Experience>();
            Templates = new Collection<Template>();
            Users = new Collection<User>();
        }

        public ICollection<Objective> Objectives { get; set; }
        public ICollection<Experience> Experiences { get; set; }
        public ICollection<Template> Templates { get; set; }
        public ICollection<User> Users { get; set; }

        public void Save()
        {

        }
    }
}
