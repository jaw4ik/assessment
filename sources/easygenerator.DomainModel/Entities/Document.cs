using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Document : Entity, ILearningPathEntity
    {
        protected internal Document()
        {
            LearningPathCollection = new Collection<LearningPath>();
        }

        protected internal Document(string title, string embedCode, DocumentType documentType, string createdBy) : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            EmbedCode = embedCode;
            DocumentType = documentType;

            LearningPathCollection = new Collection<LearningPath>();
        }

        public string Title { get; private set; }

        public string EmbedCode { get; private set; }

        public DocumentType DocumentType { get; private set; }

        protected internal virtual ICollection<LearningPath> LearningPathCollection { get; set; }
   
        public virtual IEnumerable<LearningPath> LearningPaths => LearningPathCollection.AsEnumerable();

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateEmbedCode(string embedCode, string modifiedBy)
        {
            ThrowIfEmbedCodeIsInvalid(embedCode);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            EmbedCode = embedCode;
            MarkAsModified(modifiedBy);
        }

        #region Guard methods

        private static void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, nameof(title));
            ArgumentValidation.ThrowIfLongerThan255(title, nameof(title));
        }

        private static void ThrowIfEmbedCodeIsInvalid(string embedCode)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(embedCode, nameof(embedCode));
            ArgumentValidation.ThrowIfLongerThan65535(embedCode, nameof(embedCode));
        }

        #endregion

    }
}

