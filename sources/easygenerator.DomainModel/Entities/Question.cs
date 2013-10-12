using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Question : Entity
    {
        protected internal Question() { }

        protected internal Question(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;

            AnswersCollection = new Collection<Answer>();
            LearningObjectsCollection = new Collection<LearningObject>();
        }

        public string Title { get; private set; }

        public virtual Objective Objective { get; internal set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        protected internal virtual ICollection<Answer> AnswersCollection { get; set; }

        public IEnumerable<Answer> Answers
        {
            get { return AnswersCollection.AsEnumerable(); }
        }

        public virtual void AddAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Add(answer);
            answer.Question = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Remove(answer);
            answer.Question = null;
            MarkAsModified(modifiedBy);
        }

        protected internal virtual ICollection<LearningObject> LearningObjectsCollection { get; set; }

        public IEnumerable<LearningObject> LearningObjects
        {
            get { return LearningObjectsCollection.AsEnumerable(); }
        }

        public virtual void AddLearningObject(LearningObject learningObject, string modifiedBy)
        {
            ThrowIfLearningObjectIsInvalid(learningObject);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningObjectsCollection.Add(learningObject);
            learningObject.Question = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveLearningObject(LearningObject learningObject, string modifiedBy)
        {
            ThrowIfLearningObjectIsInvalid(learningObject);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningObjectsCollection.Remove(learningObject);
            learningObject.Question = null;
            MarkAsModified(modifiedBy);
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfAnswerIsInvalid(Answer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }

        private void ThrowIfLearningObjectIsInvalid(LearningObject learningObject)
        {
            ArgumentValidation.ThrowIfNull(learningObject, "explanation");
        }

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
