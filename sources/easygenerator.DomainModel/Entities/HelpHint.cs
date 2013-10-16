using System;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class HelpHint : Entity
    {
        public static readonly string[] AllowedHintKeys = new[] { "experiences", "experience", "createExperience", "objectives", "objective", "createObjective", "question", "createQuestion" };

        protected internal HelpHint() { }

        protected internal HelpHint(string name, string createdBy)
            : base(createdBy)
        {
            ThrowIfNameIsInvalid(name);

            Name = name;
        }

        private void ThrowIfNameIsInvalid(string name)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, "name");

            if (!AllowedHintKeys.Contains(name))
            {
                throw new ArgumentException("Not allowed hint name", "name");
            }
        }

        public string Name { get; protected set; }
    }
}
