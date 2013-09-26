using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        }

        public ICollection<Objective> Objectives { get; set; }
        public ICollection<Experience> Experiences { get; set; }
        public ICollection<Template> Templates { get; set; }

        public void Save()
        {

        }
    }
}
