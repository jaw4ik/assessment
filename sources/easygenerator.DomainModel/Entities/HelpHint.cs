using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class HelpHint : Entity
    {
        protected internal HelpHint() { }

        protected internal HelpHint(string name, string createdBy)
            : base(createdBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, "name");

            Name = name;
        }

        public string Name { get; protected set; }
    }
}
