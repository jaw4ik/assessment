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
            Users = new Collection<User>();
            Templates = new Collection<Template>()
            {
                new Template("Default", "/Content/images/defaultTemplate.png", "Some user"),
                new Template("Quiz", "/Content/images/quizTemplate.png", "Some user")
            };
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
