﻿using System.Collections.Generic;
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
            LearningContentsCollection = new Collection<LearningContent>();
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

        protected internal virtual ICollection<LearningContent> LearningContentsCollection { get; set; }

        public IEnumerable<LearningContent> LearningContents
        {
            get { return LearningContentsCollection.AsEnumerable(); }
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

        private void ThrowIfAnswerIsInvalid(Answer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }

        private void ThrowIfLearningContentIsInvalid(LearningContent learningContent)
        {
            ArgumentValidation.ThrowIfNull(learningContent, "explanation");
        }

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
