using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public class DataContext : IDataContext
    {
        public DataContext()
        {
            Objectives = new Collection<Objective>();
        }
        public ICollection<Objective> Objectives { get; set; }
    }
}
