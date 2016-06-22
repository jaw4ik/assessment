﻿using easygenerator.DomainModel.Events.CommentEvents;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.CourseEvents.Collaboration;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    public class Course : Entity, ILearningPathEntity, IPublishableEntity
    {
        protected internal Course()
        {
            RelatedSectionsCollection = new Collection<Section>();
            CommentsCollection = new Collection<Comment>();
            CollaboratorsCollection = new Collection<CourseCollaborator>();
            TemplateSettings = new Collection<CourseTemplateSettings>();
            LearningPathCollection = new Collection<LearningPath>();
            CourseCompanies = new Collection<Company>();
        }

        protected internal Course(string title, Template template, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfTemplateIsInvaid(template);

            Title = title;
            Template = template;
            RelatedSectionsCollection = new Collection<Section>();
            CommentsCollection = new Collection<Comment>();
            CollaboratorsCollection = new Collection<CourseCollaborator>();
            TemplateSettings = new Collection<CourseTemplateSettings>();
            LearningPathCollection = new Collection<LearningPath>();
            CourseCompanies = new Collection<Company>();
            BuildOn = null;
            IntroductionContent = null;
            SectionsOrder = null;
        }

        public virtual Template Template { get; private set; }

        public virtual void UpdateTemplate(Template template, string modifiedBy)
        {
            ThrowIfTemplateIsInvaid(template);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Template = template;
            MarkAsModified(modifiedBy);

            template.GrantAccessTo(Collaborators.Select(_ => _.Email).Concat(new[] { CreatedBy }).ToArray());

            RaiseEvent(new CourseTemplateUpdatedEvent(this));
        }

        protected internal virtual ICollection<LearningPath> LearningPathCollection { get; set; }

        public virtual IEnumerable<LearningPath> LearningPaths => LearningPathCollection.AsEnumerable();

        #region Collaboration

        protected internal virtual ICollection<CourseCollaborator> CollaboratorsCollection { get; set; }

        public virtual IEnumerable<CourseCollaborator> Collaborators => CollaboratorsCollection.AsEnumerable();

        public virtual CourseCollaborator Collaborate(string userEmail, string createdBy)
        {
            ThrowIfUserEmailIsInvalid(userEmail);
            if (CreatedBy == userEmail || Collaborators.Any(e => e.Email.Equals(userEmail, StringComparison.InvariantCultureIgnoreCase)))
                return null;

            var collaborator = new CourseCollaborator(this, userEmail, false, createdBy);
            CollaboratorsCollection.Add(collaborator);
            Template.GrantAccessTo(userEmail);
            RaiseEvent(new CourseCollaboratorAddedEvent(collaborator));

            return collaborator;
        }

        public virtual CourseCollaborator CollaborateAsAdmin(string userEmail)
        {
            ThrowIfUserEmailIsInvalid(userEmail);

            if (CreatedBy == userEmail)
                return null;

            var collaborator = Collaborators.FirstOrDefault(c => c.Email.Equals(userEmail, StringComparison.InvariantCultureIgnoreCase));
            if (collaborator != null)
            {
                collaborator.GrantAdminAccess();
                AcceptCollaboration(collaborator);
            }
            else
            {
                collaborator = new CourseCollaborator(this, userEmail, true, userEmail, true);
                CollaboratorsCollection.Add(collaborator);
                Template.GrantAccessTo(userEmail);
                RaiseEvent(new CourseCollaboratorAddedEvent(collaborator));
            }

            return collaborator;
        }

        public virtual bool RemoveCollaborator(ICloner entityCloner, string collaboratorEmail)
        {
            var collaborator = CollaboratorsCollection.FirstOrDefault(e => e.Email.Equals(collaboratorEmail, StringComparison.InvariantCultureIgnoreCase));
            if (collaborator == null)
            {
                return false;
            }

            collaborator.Course = null;
            CollaboratorsCollection.Remove(collaborator);
            CloneSectionsOfCollaborator(entityCloner, collaborator.Email);

            MarkAsModified(CreatedBy);
            RaiseEvent(new CourseCollaboratorRemovedEvent(this, collaborator));

            return true;
        }

        public virtual void AcceptCollaboration(CourseCollaborator collaborator)
        {
            ThrowIfCollaboratorIsInvalid(collaborator);
            if (collaborator.IsAccepted)
            {
                return;
            }

            collaborator.IsAccepted = true;
            RaiseEvent(new CollaborationInviteAcceptedEvent(this, collaborator));
        }

        public virtual void DeclineCollaboration(CourseCollaborator collaborator)
        {
            ThrowIfCollaboratorIsInvalid(collaborator);

            CollaboratorsCollection.Remove(collaborator);
            RaiseEvent(new CollaborationInviteDeclinedEvent(this, collaborator));
        }

        public virtual void CloneSectionsOfCollaborator(ICloner entityCloner, string collaboratorEmail)
        {
            var clonedSections = new Dictionary<Guid, Section>();
            var sections = GetOrderedRelatedSections();

            var sectionsWereCloned = false;

            for (var i = 0; i < sections.Count; i++)
            {
                var currentSection = sections[i];
                if (currentSection.CreatedBy != collaboratorEmail)
                {
                    continue;
                }

                sectionsWereCloned = true;
                var clonedSection = entityCloner.Clone(currentSection, CreatedBy);
                RelatedSectionsCollection.Remove(currentSection);
                sections[i] = clonedSection;
                RelatedSectionsCollection.Add(clonedSection);

                clonedSections.Add(currentSection.Id, clonedSection);
            }

            if (sectionsWereCloned)
            {
                DoUpdateOrder(sections, CreatedBy);
                if (clonedSections.Any())
                {
                    RaiseEvent(new CourseSectionsClonedEvent(this, clonedSections));
                }
            }
        }

        #endregion

        #region Comments

        protected internal virtual ICollection<Comment> CommentsCollection { get; set; }
        public virtual IEnumerable<Comment> Comments => CommentsCollection.AsEnumerable();

        public virtual void AddComment(Comment comment)
        {
            ThrowIfCommentIsInvalid(comment);

            CommentsCollection.Add(comment);
            comment.Course = this;

            RaiseEvent(new CommentCreatedEvent(this, comment));
        }

        public virtual void DeleteComment(Comment comment)
        {
            ThrowIfCommentIsInvalid(comment);

            CommentsCollection.Remove(comment);
            comment.Course = null;

            RaiseEvent(new CommentDeletedEvent(this, comment));
        }

        #endregion

        #region Sections

        protected internal virtual ICollection<Section> RelatedSectionsCollection { get; set; }

        protected internal string SectionsOrder { get; set; }

        public virtual IEnumerable<Section> RelatedSections => GetOrderedRelatedSections().AsEnumerable();

        public virtual void RelateSection(Section section, int? index, string modifiedBy)
        {
            ThrowIfSectionIsInvalid(section);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!RelatedSectionsCollection.Contains(section))
            {
                var sections = GetOrderedRelatedSections();
                if (index.HasValue)
                {
                    sections.Insert(index.Value, section);
                }
                else
                {
                    sections.Add(section);
                }
                DoUpdateOrder(sections, modifiedBy);

                RelatedSectionsCollection.Add(section);
            }

            MarkAsModified(modifiedBy);

            RaiseEvent(new CourseSectionRelatedEvent(this, section, index));
        }

        public virtual void UnrelateSection(Section section, string modifiedBy)
        {
            ThrowIfSectionIsInvalid(section);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var sections = GetOrderedRelatedSections();
            sections.Remove(section);
            DoUpdateOrder(sections, modifiedBy);

            RelatedSectionsCollection.Remove(section);

            MarkAsModified(modifiedBy);

            RaiseEvent(new CourseSectionsUnrelatedEvent(this, new[] { section }));
        }

        public void UpdateSectionsOrder(ICollection<Section> sections, string modifiedBy)
        {
            DoUpdateOrder(sections, modifiedBy);
            RaiseEvent(new CourseSectionsReorderedEvent(this));
        }

        private void DoUpdateOrder(ICollection<Section> sections, string modifiedBy)
        {
            SectionsOrder = OrderingUtils.GetOrder(sections);
            MarkAsModified(modifiedBy);
        }

        private IList<Section> GetOrderedRelatedSections()
        {
            return OrderingUtils.OrderCollection(RelatedSectionsCollection, SectionsOrder);
        }

        #endregion

        public virtual IList<Section> OrderClonedSections(ICollection<Section> clonedSections)
        {
            if (clonedSections == null)
                return null;

            var originalSections = RelatedSectionsCollection.ToList();

            if (originalSections.Count != clonedSections.Count)
            {
                throw new ArgumentException("Cloned sections collection has to be same length as original.", nameof(clonedSections));
            }

            var orderedClonedSections = new List<Section>();
            foreach (var section in RelatedSections)
            {
                int index = originalSections.IndexOf(section);
                orderedClonedSections.Add(clonedSections.ElementAt(index));
            }

            return orderedClonedSections;
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

        public void ResetPublicationUrl()
        {
            PublicationUrl = null;
        }

        #region Course template settings

        protected internal virtual ICollection<CourseTemplateSettings> TemplateSettings { get; set; }

        public virtual string GetTemplateSettings(Template template)
        {
            ThrowIfTemplateIsInvaid(template);

            var templateSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            return templateSettings?.Settings;
        }

        public virtual string GetExtraDataForTemplate(Template template)
        {
            ThrowIfTemplateIsInvaid(template);

            var templateSettings = TemplateSettings.SingleOrDefault(e => e.Template == template);
            return templateSettings?.ExtraData;
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

        #region External publish

        protected internal virtual ICollection<Company> CourseCompanies { get; set; }

        public virtual IEnumerable<Company> Companies => CourseCompanies.AsEnumerable();

        public bool IsPublishedToAnyExternalLms()
        {
            return CourseCompanies.Count > 0;
        }

        public virtual void SetPublishedToExternalLms(Company company)
        {
            if (!CourseCompanies.Contains(company))
            {
                CourseCompanies.Add(company);
            }
        }

        #endregion

        #region Guard methods

        public void ThrowIfCommentIsInvalid(Comment comment)
        {
            ArgumentValidation.ThrowIfNull(comment, nameof(comment));
        }

        public void ThrowIfUserEmailIsInvalid(string userEmail)
        {
            ArgumentValidation.ThrowIfNull(userEmail, nameof(userEmail));
        }

        public void ThrowIfTemplateIsInvaid(Template template)
        {
            ArgumentValidation.ThrowIfNull(template, nameof(template));
        }

        public void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, nameof(title));
            ArgumentValidation.ThrowIfLongerThan255(title, nameof(title));
        }

        public void ThrowIfSectionIsInvalid(Section section)
        {
            ArgumentValidation.ThrowIfNull(section, nameof(section));
        }

        public void ThrowIfPackageUrlIsInvalid(string packageUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(packageUrl, nameof(packageUrl));
        }

        private static void ThrowIfCollaboratorIsInvalid(CourseCollaborator courseCollaborator)
        {
            ArgumentValidation.ThrowIfNull(courseCollaborator, nameof(courseCollaborator));
        }

        #endregion

    }
}
