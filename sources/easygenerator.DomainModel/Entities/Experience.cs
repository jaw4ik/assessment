using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Experience : Entity
    {
        protected internal Experience() { }

        protected internal Experience(string title)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            _relatedObjectives = new Collection<Objective>();
        }

        public string Title { get; private set; }
        private ICollection<Objective> _relatedObjectives { get; set; }

        public IEnumerable<Objective> RelatedObjectives
        {
            get
            {
                return _relatedObjectives.AsEnumerable();
            }
        }

        public void RelateObjective(Objective objective)
        {
            ThrowIfObjectiveIsInvalid(objective);

            if (!_relatedObjectives.Contains(objective))
            {
                _relatedObjectives.Add(objective);
            }

            MarkAsModified();
        }

        public void UnrelateObjective(Objective objective)
        {
            ThrowIfObjectiveIsInvalid(objective);

            _relatedObjectives.Remove(objective);
            MarkAsModified();
        }

        public virtual void UpdateTitle(string title)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            MarkAsModified();
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfObjectiveIsInvalid(Objective objective)
        {
            ArgumentValidation.ThrowIfNull(objective, "objective");
        }
    }
}
