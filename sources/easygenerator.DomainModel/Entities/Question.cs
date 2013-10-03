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

            _answers = new Collection<Answer>();
            _learningObjects = new Collection<LearningObject>();
        }

        public string Title { get; private set; }

        public Objective Objective { get; internal set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        private readonly ICollection<Answer> _answers;

        public IEnumerable<Answer> Answers
        {
            get { return _answers.AsEnumerable(); }
        }

        public virtual void AddAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _answers.Add(answer);
            answer.Question = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _answers.Remove(answer);
            answer.Question = null;
            MarkAsModified(modifiedBy);
        }

        private readonly ICollection<LearningObject> _learningObjects;

        public IEnumerable<LearningObject> LearningObjects
        {
            get { return _learningObjects.AsEnumerable(); }
        }

        public virtual void AddLearningObject(LearningObject learningObject, string modifiedBy)
        {
            ThrowIfLearningObjectIsInvalid(learningObject);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _learningObjects.Add(learningObject);
            learningObject.Question = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveLearningObject(LearningObject learningObject, string modifiedBy)
        {
            ThrowIfLearningObjectIsInvalid(learningObject);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _learningObjects.Remove(learningObject);
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
