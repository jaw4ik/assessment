using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public abstract class Question : Entity
    {
        protected internal Question() { }

        protected internal Question(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;

            LearningContentsCollection = new Collection<LearningContent>();
        }

        public string Title { get; private set; }

        //TODO: Move to derived type
        public string Content { get; private set; }

        public virtual Objective Objective { get; internal set; }

        protected internal virtual ICollection<LearningContent> LearningContentsCollection { get; set; }

        public IEnumerable<LearningContent> LearningContents
        {
            get { return LearningContentsCollection.AsEnumerable(); }
        }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        public virtual void UpdateContent(string content, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Content = content;
            MarkAsModified(modifiedBy);
        }


        public virtual void AddLearningContent(LearningContent learningContent, string modifiedBy)
        {
            ThrowIfLearningContentIsInvalid(learningContent);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningContentsCollection.Add(learningContent);
            learningContent.Question = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveLearningContent(LearningContent learningContent, string modifiedBy)
        {
            ThrowIfLearningContentIsInvalid(learningContent);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningContentsCollection.Remove(learningContent);
            learningContent.Question = null;
            MarkAsModified(modifiedBy);
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfLearningContentIsInvalid(LearningContent learningContent)
        {
            ArgumentValidation.ThrowIfNull(learningContent, "explanation");
        }
    }    
}
