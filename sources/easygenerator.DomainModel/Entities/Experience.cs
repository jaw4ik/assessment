using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Experience : Entity
    {
        protected internal Experience() { }

        protected internal Experience(string title, Template template, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfTemplateIsInvaid(template);

            Title = title;
            Template = template;
            RelatedObjectivesCollection = new Collection<Objective>();
            BuildOn = null;
        }

        public virtual Template Template { get; private set; }

        public virtual void UpdateTemplate(Template template, string modifiedBy)
        {
            ThrowIfTemplateIsInvaid(template);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Template = template;
            MarkAsModified(modifiedBy);
        }

        protected internal virtual ICollection<Objective> RelatedObjectivesCollection { get; set; }

        public IEnumerable<Objective> RelatedObjectives
        {
            get { return RelatedObjectivesCollection.AsEnumerable(); }
        }

        public virtual void RelateObjective(Objective objective, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!RelatedObjectivesCollection.Contains(objective))
            {
                RelatedObjectivesCollection.Add(objective);
            }

            MarkAsModified(modifiedBy);
        }

        public virtual void UnrelateObjective(Objective objective, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            RelatedObjectivesCollection.Remove(objective);
            MarkAsModified(modifiedBy);
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        public DateTime? BuildOn { get; private set; }

        public string PackageUrl { get; private set; }

        public virtual void UpdatePackageUrl(string packageUrl)
        {
            ThrowIfPackageUrlIsInvalid(packageUrl);

            PackageUrl = packageUrl;
            BuildOn = DateTimeWrapper.Now();
        }

        public DateTime? PublishedOn { get; private set; }
        public virtual void UpdatePublishedOnDate()
        {
            PublishedOn = DateTimeWrapper.Now();
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
