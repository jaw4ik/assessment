using System;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

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
            public const string HotSpot = "hotspot";
            public const string Statement = "statement";
            public const string OpenQuestion = "openQuestion";
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
            LearningContentsOrder = null;
        }

        public string Title { get; private set; }

        //TODO: Move to derived type
        public string Content { get; protected set; }

        public virtual Objective Objective { get; internal set; }

        protected internal virtual ICollection<LearningContent> LearningContentsCollection { get; set; }

        public IEnumerable<LearningContent> LearningContents
        {
            get { return GetOrderedLearningContents().AsEnumerable(); }
        }

        protected internal string LearningContentsOrder { get; set; }

        public Feedback Feedback { get; private set; }

        public virtual void UpdateGeneralFeedbackText(string feedbackText)
        {
            Feedback.GeneralText = feedbackText;

            RaiseEvent(new QuestionGeneralFeedbackUpdatedEvent(this));
        }

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

            var learningContents = GetOrderedLearningContents();
            learningContents.Add(learningContent);
            DoUpdateLearningContentsOrder(learningContents);

            LearningContentsCollection.Add(learningContent);
            learningContent.Question = this;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentCreatedEvent(learningContent));
        }

        public virtual void RemoveLearningContent(LearningContent learningContent, string modifiedBy)
        {
            ThrowIfLearningContentIsInvalid(learningContent);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var learningContents = GetOrderedLearningContents();
            learningContents.Remove(learningContent);
            DoUpdateLearningContentsOrder(learningContents);

            LearningContentsCollection.Remove(learningContent);
            learningContent.Question = null;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentDeletedEvent(this, learningContent));
        }

        public virtual void UpdateLearningContentsOrder(ICollection<LearningContent> learningContents, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNull(learningContents, "learningContents");

            DoUpdateLearningContentsOrder(learningContents);
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentsReorderedEvent(this));
        }

        public virtual IList<LearningContent> OrderClonedLearningContents(ICollection<LearningContent> clonedLearningContents)
        {
            if (clonedLearningContents == null)
                return null;

            var originalQuestions = LearningContentsCollection.ToList();

            if (originalQuestions.Count != clonedLearningContents.Count)
            {
                throw new ArgumentException("Cloned learning contents collection has to be same length as original.", "clonedLearningContents");
            }

            return LearningContents.Select(obj => clonedLearningContents.ElementAt(originalQuestions.IndexOf(obj))).ToList();
        }

        private void DoUpdateLearningContentsOrder(ICollection<LearningContent> learningContents)
        {
            LearningContentsOrder = learningContents.Count == 0 ? null : String.Join(",", learningContents.Select(i => i.Id).ToArray());
        }

        private ICollection<LearningContent> GetOrderedLearningContents()
        {
            if (String.IsNullOrEmpty(LearningContentsOrder))
            {
                return LearningContentsCollection.ToList();
            }

            var orderedLearningContentsIds = LearningContentsOrder.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
            return LearningContentsCollection.OrderBy(item => GetLearningContentIndex(orderedLearningContentsIds, item)).ToList();
        }

        private static int GetLearningContentIndex(IList<string> orderedLearningContentsIds, Identifiable learningContent)
        {
            var index = orderedLearningContentsIds.IndexOf(learningContent.Id.ToString());
            return index > -1 ? index : orderedLearningContentsIds.Count;
        }

        private static void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private static void ThrowIfLearningContentIsInvalid(LearningContent learningContent)
        {
            ArgumentValidation.ThrowIfNull(learningContent, "explanation");
        }
    }
}
