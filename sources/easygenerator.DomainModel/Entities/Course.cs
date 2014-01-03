using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Course : Entity
    {
        protected internal Course() { }

        protected internal Course(string title, Template template, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfTemplateIsInvaid(template);

            Title = title;
            Template = template;
            RelatedObjectivesCollection = new Collection<Objective>();
            TemplateSettings = new Collection<CourseTemplateSettings>();
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

        public DateTime? BuildOn { get; protected internal set; }

        public string PackageUrl { get; private set; }

        public virtual void UpdatePackageUrl(string packageUrl)
        {
            ThrowIfPackageUrlIsInvalid(packageUrl);

            PackageUrl = packageUrl;
            BuildOn = DateTimeWrapper.Now();
        }

        public DateTime? PublishedOn { get; protected internal set; }
        public virtual void UpdatePublishedOnDate()
        {
            PublishedOn = DateTimeWrapper.Now();
        }

        #region Course template settings

        protected internal class CourseTemplateSettings : Entity
        {
            public CourseTemplateSettings()
            {

            }

            public CourseTemplateSettings(string createdBy)
                : base(createdBy)
            {

            }

            public virtual Course Course { get; set; }
            public virtual Template Template { get; set; }
            public string Settings { get; set; }
        }

        protected internal virtual ICollection<CourseTemplateSettings> TemplateSettings { get; set; }

        public virtual string GetTemplateSettings(Template template)
        {
            ThrowIfTemplateIsInvaid(template);

            var templateSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            return templateSettings != null ? templateSettings.Settings : null;
        }

        public virtual void SaveTemplateSettings(Template template, string settings)
        {
            ThrowIfTemplateIsInvaid(template);

            var existingSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            if (existingSettings != null)
            {
                existingSettings.Settings = settings;
                return;
            }

            TemplateSettings.Add(new CourseTemplateSettings(CreatedBy)
            {
                Course = this,
                Template = template,
                Settings = settings
            });
        }

        #endregion

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
