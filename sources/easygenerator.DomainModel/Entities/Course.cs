using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    public class Course : Entity
    {
        protected internal Course()
        {
            RelatedObjectivesCollection = new Collection<Objective>();
            CommentsCollection = new Collection<Comment>();
            CollaboratorsCollection = new Collection<CourseCollaborator>();
            TemplateSettings = new Collection<CourseTemplateSettings>();
            LearningPathCollection = new Collection<LearningPath>();
        }

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
            LearningPathCollection = new Collection<LearningPath>();
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

            template.GrantAccessTo(Collaborators.Select(_ => _.Email).ToArray());

            RaiseEvent(new CourseTemplateUpdatedEvent(this));
        }

        protected internal virtual ICollection<LearningPath> LearningPathCollection { get; set; }

        public virtual IEnumerable<LearningPath> LearningPaths
        {
            get { return LearningPathCollection.AsEnumerable(); }
        }

        #region Collaboration

        protected internal virtual ICollection<CourseCollaborator> CollaboratorsCollection { get; set; }

        public virtual IEnumerable<CourseCollaborator> Collaborators
        {
            get { return CollaboratorsCollection.AsEnumerable(); }
        }

        public virtual CourseCollaborator Collaborate(string username, string createdBy)
        {
            ThrowIfUserEmailIsInvalid(username);
            if (CreatedBy == username || Collaborators.Any(e => e.Email.Equals(username, StringComparison.InvariantCultureIgnoreCase)))
                return null;

            var collaborator = new CourseCollaborator(this, username, createdBy);
            CollaboratorsCollection.Add(collaborator);
            Template.GrantAccessTo(username);
            RaiseEvent(new CourseCollaboratorAddedEvent(collaborator));

            return collaborator;
        }

        public virtual void RemoveCollaborator(ICloner entityCloner, CourseCollaborator collaborator)
        {
            ThrowIfCollaboratorIsInvalid(collaborator);

            collaborator.Course = null;
            CollaboratorsCollection.Remove(collaborator);
            CloneObjectivesOfCollaborator(entityCloner, collaborator.Email);

            MarkAsModified(CreatedBy);

            RaiseEvent(new CourseCollaboratorRemovedEvent(this, collaborator));
        }

        public virtual void AcceptCollaboration(CourseCollaborator collaborator)
        {
            ThrowIfCollaboratorIsInvalid(collaborator);

            collaborator.IsAccepted = true;
            RaiseEvent(new CollaborationInviteAcceptedEvent(this, collaborator));
        }

        public virtual void DeclineCollaboration(CourseCollaborator collaborator)
        {
            ThrowIfCollaboratorIsInvalid(collaborator);

            CollaboratorsCollection.Remove(collaborator);
            RaiseEvent(new CollaborationInviteDeclinedEvent(this, collaborator));
        }

        private void CloneObjectivesOfCollaborator(ICloner entityCloner, string collaboratorEmail)
        {
            var clonedObjectives = new Dictionary<Guid, Objective>();
            var objectives = GetOrderedRelatedObjectives();

            bool objectivesWereCloned = false;

            for (int i = 0; i < objectives.Count; i++)
            {
                var currentObjective = objectives[i];
                if (currentObjective.CreatedBy != collaboratorEmail)
                {
                    continue;
                }

                objectivesWereCloned = true;
                var clonedObjective = entityCloner.Clone(currentObjective, CreatedBy);
                RelatedObjectivesCollection.Remove(currentObjective);
                objectives[i] = clonedObjective;
                RelatedObjectivesCollection.Add(clonedObjective);

                clonedObjectives.Add(currentObjective.Id, clonedObjective);
            }

            if (objectivesWereCloned)
            {
                DoUpdateOrder(objectives, CreatedBy);
                if (clonedObjectives.Any())
                {
                    RaiseEvent(new CourseObjectivesClonedEvent(this, clonedObjectives));
                }
            }
        }

        #endregion

        #region Comments

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

        #endregion

        #region Objectives

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
                DoUpdateOrder(objectives, modifiedBy);

                RelatedObjectivesCollection.Add(objective);
            }

            MarkAsModified(modifiedBy);

            RaiseEvent(new CourseObjectiveRelatedEvent(this, objective, index));
        }

        public virtual void UnrelateObjective(Objective objective, string modifiedBy)
        {
            ThrowIfObjectiveIsInvalid(objective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var objectives = GetOrderedRelatedObjectives();
            objectives.Remove(objective);
            DoUpdateOrder(objectives, modifiedBy);

            RelatedObjectivesCollection.Remove(objective);

            MarkAsModified(modifiedBy);

            RaiseEvent(new CourseObjectivesUnrelatedEvent(this, new[] { objective }));
        }

        public void UpdateObjectivesOrder(ICollection<Objective> objectives, string modifiedBy)
        {
            DoUpdateOrder(objectives, modifiedBy);
            RaiseEvent(new CourseObjectivesReorderedEvent(this));
        }

        private void DoUpdateOrder(ICollection<Objective> objectives, string modifiedBy)
        {
            ObjectivesOrder = OrderingUtils.GetOrder(objectives);
            MarkAsModified(modifiedBy);
        }

        private IList<Objective> GetOrderedRelatedObjectives()
        {
            return OrderingUtils.OrderCollection(RelatedObjectivesCollection, ObjectivesOrder);
        }

        #endregion

        public virtual IList<Objective> OrderClonedObjectives(ICollection<Objective> clonedObjectives)
        {
            if (clonedObjectives == null)
                return null;

            var originalObjectives = RelatedObjectivesCollection.ToList();

            if (originalObjectives.Count != clonedObjectives.Count)
            {
                throw new ArgumentException("Cloned objectives collection has to be same length as original.", "clonedObjectives");
            }

            var orderedClonedObjectives = new List<Objective>();
            foreach (var objective in RelatedObjectives)
            {
                int index = originalObjectives.IndexOf(objective);
                orderedClonedObjectives.Add(clonedObjectives.ElementAt(index));
            }

            return orderedClonedObjectives;
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);

            RaiseEvent(new CourseTitleUpdatedEvent(this));
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

            RaiseEvent(new CourseIntroductionContentUpdated(this));
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

            RaiseEvent(new CoursePublishedEvent(this));
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
            public string ExtraData { get; set; }
        }

        protected internal virtual ICollection<CourseTemplateSettings> TemplateSettings { get; set; }

        public virtual string GetTemplateSettings(Template template)
        {
            ThrowIfTemplateIsInvaid(template);

            var templateSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            return templateSettings != null ? templateSettings.Settings : null;
        }

        public virtual string GetExtraDataForTemplate(Template template)
        {
            ThrowIfTemplateIsInvaid(template);

            var templateSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            return templateSettings != null ? templateSettings.ExtraData : null;
        }

        public virtual void SaveTemplateSettings(Template template, string settings, string extraData)
        {
            ThrowIfTemplateIsInvaid(template);

            var existingSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            if (existingSettings != null)
            {
                existingSettings.Settings = settings;
                existingSettings.ExtraData = extraData;
                RaiseEvent(new CourseTemplateSettingsUpdated(this));

                return;
            }

            TemplateSettings.Add(new CourseTemplateSettings(CreatedBy)
            {
                Course = this,
                Template = template,
                Settings = settings,
                ExtraData = extraData
            });

            RaiseEvent(new CourseTemplateSettingsUpdated(this));
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

        #region Guard methods

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

        private void ThrowIfPackageUrlIsInvalid(string packageUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(packageUrl, "packageUrl");
        }

        private void ThrowIfCollaboratorIsInvalid(CourseCollaborator courseCollaborator)
        {
            ArgumentValidation.ThrowIfNull(courseCollaborator, "courseCollaborator");
        }

        #endregion

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

