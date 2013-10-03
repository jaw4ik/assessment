using System;
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
        public DateTime? BuildOn { get; private set; }
        public string PackageUrl { get; private set; }

        private ICollection<Objective> _relatedObjectives { get; set; }
        public IEnumerable<Objective> RelatedObjectives
        {
            get
            {
                return _relatedObjectives.AsEnumerable();
            }
        }
        
        protected internal Experience(string title, Template template, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfTemplateIsInvaid(template);

            Title = title;
            Template = template;
            _relatedObjectives = new Collection<Objective>();
            BuildOn = null;
        }

        public virtual void UpdateTemplate(Template template, string modifiedBy)
        {
            ThrowIfTemplateIsInvaid(template);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Template = template;
            MarkAsModified(modifiedBy);
        }

        public virtual void RelateObjective(Objective objective, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!_relatedObjectives.Contains(objective))
            {
                _relatedObjectives.Add(objective);
            }

            MarkAsModified(modifiedBy);
        }

        public virtual void UnrelateObjective(Objective objective, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _relatedObjectives.Remove(objective);
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdatePackageUrl(string packageUrl)
        {
            ThrowIfPackageUrlIsInvalid(packageUrl);

            PackageUrl = packageUrl;
            BuildOn = DateTimeWrapper.Now();
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

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }

        private void ThrowIfPackageUrlIsInvalid(string packageUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(packageUrl, "packageUrl");
        }
    }
}
