using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

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
            CommentsCollection = new Collection<Comment>();
            CollaboratorsCollection = new Collection<CourseCollaborator>();
            TemplateSettings = new Collection<CourseTemplateSettings>();
            BuildOn = null;
            IntroductionContent = null;
            ObjectivesOrder = null;
        }

        public virtual Template Template { get; private set; }

        public virtual void UpdateTemplate(Template template, string modifiedBy)
        {
            ThrowIfTemplateIsInvaid(template);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Template = template;
            MarkAsModified(modifiedBy);
        }

        protected internal virtual ICollection<CourseCollaborator> CollaboratorsCollection { get; set; }
        public virtual IEnumerable<CourseCollaborator> Collaborators
        {
            get { return CollaboratorsCollection.AsEnumerable(); }
        }

        public virtual CourseCollaborator Collaborate(string username, string createdBy)
        {
            ThrowIfUserEmailIsInvalid(username);
            if (CreatedBy == username || Collaborators.Any(e => e.Email == username))
                return null;

            var collaborator = new CourseCollaborator(this, username, createdBy);
            CollaboratorsCollection.Add(collaborator);

            return collaborator;
        }

        protected internal virtual ICollection<Comment> CommentsCollection { get; set; }
        public virtual IEnumerable<Comment> Comments
        {
            get { return CommentsCollection.AsEnumerable(); }
        }

        public virtual void AddComment(Comment comment)
        {
            ThrowIfCommentIsInvalid(comment);

            CommentsCollection.Add(comment);
            comment.Course = this;
        }

        protected internal virtual ICollection<Objective> RelatedObjectivesCollection { get; set; }

        protected internal string ObjectivesOrder { get; set; }

        public IEnumerable<Objective> RelatedObjectives
        {
            get { return GetOrderedRelatedObjectives().AsEnumerable(); }
        }

        public virtual void RelateObjective(Objective objective, int? index, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!RelatedObjectivesCollection.Contains(objective))
            {
                var objectives = GetOrderedRelatedObjectives();
                if (index.HasValue)
                {
                    objectives.Insert(index.Value, objective);
                }
                else
                {
                    objectives.Add(objective);
                }
                UpdateObjectivesOrder(objectives, modifiedBy);

                RelatedObjectivesCollection.Add(objective);
            }

            MarkAsModified(modifiedBy);
        }

        public virtual void UnrelateObjective(Objective objective, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var objectives = GetOrderedRelatedObjectives();
            objectives.Remove(objective);
            UpdateObjectivesOrder(objectives, modifiedBy);

            RelatedObjectivesCollection.Remove(objective);

            MarkAsModified(modifiedBy);
        }

        public void UpdateObjectivesOrder(ICollection<Objective> objectives, string modifiedBy)
        {
            ObjectivesOrder = objectives.Count == 0 ? null : String.Join(",", objectives.Select(i => i.Id).ToArray());
            MarkAsModified(modifiedBy);
        }

        private IList<Objective> GetOrderedRelatedObjectives()
        {
            if (ObjectivesOrder == null)
            {
                return RelatedObjectivesCollection.ToList();
            }

            var orderedObjectiveIds = ObjectivesOrder.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
            return RelatedObjectivesCollection.OrderBy(objective => GetObjectiveIndex(orderedObjectiveIds, objective)).ToList();
        }

        private int GetObjectiveIndex(List<string> orderedObjectiveIds, Objective objective)
        {
            var index = orderedObjectiveIds.IndexOf(objective.Id.ToString());
            return index > -1 ? index : orderedObjectiveIds.Count;
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

        public string IntroductionContent { get; private set; }

        public virtual void UpdateIntroductionContent(string introductionContent, string modifiedBy)
        {
            IntroductionContent = introductionContent;
            MarkAsModified(modifiedBy);
        }

        public string ScormPackageUrl { get; private set; }

        public virtual void UpdateScormPackageUrl(string scormPackageUrl)
        {
            ThrowIfPackageUrlIsInvalid(scormPackageUrl);

            ScormPackageUrl = scormPackageUrl;
        }

        public DateTime? PublishedOn { get; protected internal set; }
        public string PublicationUrl { get; private set; }

        public virtual void UpdatePublicationUrl(string publicationUrl)
        {
            PublicationUrl = publicationUrl;
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

        #region Aim4You integration

        public virtual Aim4YouIntegration Aim4YouIntegration { get; private set; }

        public virtual void RegisterOnAim4YOu(Guid aim4YouCourseId)
        {
            if (Aim4YouIntegration == null)
            {
                Aim4YouIntegration = new Aim4YouIntegration();
            }
            Aim4YouIntegration.UpdateAim4YouCourseId(aim4YouCourseId);
        }

        public bool IsRegisteredOnAimForYou()
        {
            return Aim4YouIntegration != null && !Aim4YouIntegration.Aim4YouCourseId.Equals(Guid.Empty);
        }

        #endregion

        private void ThrowIfCommentIsInvalid(Comment comment)
        {
            ArgumentValidation.ThrowIfNull(comment, "comment");
        }

        private void ThrowIfUserEmailIsInvalid(string userEmail)
        {
            ArgumentValidation.ThrowIfNull(userEmail, "userEmail");
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

    public class Aim4YouIntegration
    {
        public Guid Id { get; set; }
        public Guid Aim4YouCourseId { get; private set; }

        public virtual void UpdateAim4YouCourseId(Guid aim4YouCourseId)
        {
            Aim4YouCourseId = aim4YouCourseId;
        }

        public Course Course { get; set; }
    }
}
