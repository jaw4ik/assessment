using easygenerator.Infrastructure;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    public class LearningPath : Entity, IPublishableEntity
    {
        protected internal LearningPath()
        {
        }

        protected internal LearningPath(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            CoursesCollection = new Collection<Course>();
            DocumentsCollection = new Collection<Document>();

            Title = title;
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        public string PackageUrl { get; private set; }
        public virtual void UpdatePackageUrl(string packageUrl)
        {
            ThrowIfPackageUrlIsInvalid(packageUrl);

            PackageUrl = packageUrl;
        }

        public string PublicationUrl { get; private set; }
        public virtual void UpdatePublicationUrl(string publicationUrl)
        {
            ThrowIfPublicationUrlIsInvalid(publicationUrl);

            PublicationUrl = publicationUrl;
        }

        public void ResetPublicationUrl()
        {
            PublicationUrl = null;
        }

        public bool IsPublishedToExternalLms { get; private set; }

        public void SetPublishedToExternalLms()
        {
            IsPublishedToExternalLms = true;
        }

        #region Courses

        protected internal virtual ICollection<Course> CoursesCollection { get; set; }

        protected internal virtual ICollection<Document> DocumentsCollection { get; set; }

        protected internal string EntitiesOrder { get; set; }

        public virtual IEnumerable<ILearningPathEntity> Entities
        {
            get { return GetOrderedEntities().AsEnumerable(); }
        }

        public virtual void AddEntity(ILearningPathEntity entity, int? index, string modifiedBy)
        {
            ThrowIfEntityIsInvalid(entity);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!CoursesCollection.Contains(entity) && !DocumentsCollection.Contains(entity))
            {
                var entities = GetOrderedEntities();
                if (index.HasValue)
                {
                    entities.Insert(index.Value, entity);
                }
                else
                {
                    entities.Add(entity);
                }

                DoUpdateEntitiesOrder(entities, modifiedBy);

                if (entity is Course)
                {
                    CoursesCollection.Add((Course) entity);
                }
                else if (entity is Document)
                {
                    DocumentsCollection.Add((Document) entity);
                }
            }

            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveEntity(ILearningPathEntity entity, string modifiedBy)
        {
            ThrowIfEntityIsInvalid(entity);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var entities = GetOrderedEntities();
            entities.Remove(entity);
            DoUpdateEntitiesOrder(entities, modifiedBy);

            if (entity is Course)
            {
                CoursesCollection.Remove((Course) entity);
            }
            else if (entity is Document)
            {
                DocumentsCollection.Remove((Document) entity);
            }

            MarkAsModified(modifiedBy);
        }

        public void UpdateEntitiesOrder(ICollection<ILearningPathEntity> entities, string modifiedBy)
        {
            DoUpdateEntitiesOrder(entities, modifiedBy);
        }

        private void DoUpdateEntitiesOrder(ICollection<ILearningPathEntity> entities, string modifiedBy)
        {
            EntitiesOrder = OrderingUtils.GetOrder(entities);
            MarkAsModified(modifiedBy);
        }

        private IList<ILearningPathEntity> GetOrderedEntities()
        {
            return OrderingUtils.OrderCollection(CoursesCollection.Concat(DocumentsCollection.Cast<ILearningPathEntity>()), EntitiesOrder);
        }

        #endregion

        #region Guard methods

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, nameof(title));
            ArgumentValidation.ThrowIfLongerThan255(title, nameof(title));
        }

        private void ThrowIfEntityIsInvalid(ILearningPathEntity entity)
        {
            ArgumentValidation.ThrowIfNull(entity, nameof(entity));
        }

        private void ThrowIfPackageUrlIsInvalid(string packageUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(packageUrl, nameof(packageUrl));
        }

        private void ThrowIfPublicationUrlIsInvalid(string publicationUrl)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(publicationUrl, nameof(publicationUrl));
        }

        #endregion

    }
}
