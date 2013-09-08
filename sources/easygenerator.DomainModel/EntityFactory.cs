using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title);
    }

    public class EntityFactory : IEntityFactory
    {
        public Objective Objective(string title)
        {
            return new Objective(title);
        }
    }
}
