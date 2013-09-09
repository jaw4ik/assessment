using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title);
        Experience Experience(string title);
    }

    public class EntityFactory : IEntityFactory
    {
        public Objective Objective(string title)
        {
            return new Objective(title);
        }

        public Experience Experience(string title)
        {
            return new Experience(title);
        }
    }
}
