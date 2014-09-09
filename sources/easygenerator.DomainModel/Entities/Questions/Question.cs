﻿using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public abstract class Question : Entity
    {
        #region Constants

        public static class QuestionTypes
        {
            public const string MultipleSelect = "multipleSelect";
            public const string FillInTheBlanks = "fillInTheBlank";
            public const string DragAndDropText = "dragAndDropText";
            public const string SingleSelectText = "singleSelectText";
            public const string TextMatching = "textMatching";
            public const string SingleSelectImage = "singleSelectImage";
            public const string InformationContent = "informationContent";
        }

        #endregion

        protected internal Question() { }

        protected internal Question(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;

            LearningContentsCollection = new Collection<LearningContent>();
            Feedback = new Feedback();
        }

        public string Title { get; private set; }

        //TODO: Move to derived type
        public string Content { get; protected set; }

        public virtual Objective Objective { get; internal set; }

        protected internal virtual ICollection<LearningContent> LearningContentsCollection { get; set; }

        public IEnumerable<LearningContent> LearningContents
        {
            get { return LearningContentsCollection.OrderBy(item => item.CreatedOn).AsEnumerable(); }
        }

        public Feedback Feedback { get; private set; }

        public virtual void UpdateCorrectFeedbackText(string feedbackText)
        {
            Feedback.CorrectText = feedbackText;

            RaiseEvent(new QuestionCorrectFeedbackUpdatedEvent(this));
        }

        public virtual void UpdateIncorrectFeedbackText(string feedbackText)
        {
            Feedback.IncorrectText = feedbackText;

            RaiseEvent(new QuestionIncorrectFeedbackUpdatedEvent(this));
        }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionTitleUpdatedEvent(this));
        }

        public virtual void UpdateContent(string content, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Content = content;
            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionContentUpdatedEvent(this));
        }


        public virtual void AddLearningContent(LearningContent learningContent, string modifiedBy)
        {
            ThrowIfLearningContentIsInvalid(learningContent);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningContentsCollection.Add(learningContent);
            learningContent.Question = this;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentCreatedEvent(learningContent));
        }

        public virtual void RemoveLearningContent(LearningContent learningContent, string modifiedBy)
        {
            ThrowIfLearningContentIsInvalid(learningContent);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningContentsCollection.Remove(learningContent);
            learningContent.Question = null;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentDeletedEvent(this, learningContent));
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
