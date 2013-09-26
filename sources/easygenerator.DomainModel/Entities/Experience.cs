using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Experience : Entity
    {
        public string Title { get; private set; }
        public Template Template { get; private set; }

        protected internal Experience() { }

        protected internal Experience(string title, Template template)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfTemplateIsInvaid(template);

            Title = title;
            Template = template;
            _relatedObjectives = new Collection<Objective>();
        }

        public virtual void UpdateTemplate(Template template)
        {
            ThrowIfTemplateIsInvaid(template);

            Template = template;
            MarkAsModified();
        }

        private ICollection<Objective> _relatedObjectives { get; set; }

        public IEnumerable<Objective> RelatedObjectives
        {
            get
            {
                return _relatedObjectives.AsEnumerable();
            }
        }

        public virtual void RelateObjective(Objective objective)
        {
            ThrowIfObjectiveIsInvalid(objective);

            if (!_relatedObjectives.Contains(objective))
            {
                _relatedObjectives.Add(objective);
            }

            MarkAsModified();
        }

        public virtual void UnrelateObjective(Objective objective)
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
        
        private void ThrowIfTemplateIsInvaid(Template template)
        {
            ArgumentValidation.ThrowIfNull(template, "template");
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
