using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    public class Objective : Entity
    {
        protected internal Objective() { }

        protected internal Objective(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            Title = title;

            RelatedCoursesCollection = new Collection<Course>();
            QuestionsCollection = new Collection<Question>();
            QuestionsOrder = null;
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);

            RaiseEvent(new ObjectiveTitleUpdatedEvent(this));
        }

        public string ImageUrl { get; private set; }

        public virtual void UpdateImageUrl(string url, string modifiedBy)
        {
            ThrowIfImageUrlIsInvalid(url);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ImageUrl = url;
            MarkAsModified(modifiedBy);
            RaiseEvent(new ObjectiveImageUrlUpdatedEvent(this));
        }

        protected internal virtual ICollection<Course> RelatedCoursesCollection { get; set; }

        public virtual IEnumerable<Course> Courses
        {
            get { return RelatedCoursesCollection.AsEnumerable(); }
        }

        protected internal virtual ICollection<Question> QuestionsCollection { get; set; }

        public virtual IEnumerable<Question> Questions
        {
            get { return GetOrderedQuestions().AsEnumerable(); }
        }

        protected internal string QuestionsOrder { get; set; }

        public virtual void AddQuestion(Question question, string modifiedBy)
        {
            ThrowIfQuestionIsInvalid(question);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!QuestionsCollection.Contains(question))
            {
                var questions = GetOrderedQuestions();
                questions.Add(question);
                DoUpdateQuestionsOrder(questions);

                QuestionsCollection.Add(question);
                question.Objective = this;
            }

            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionCreatedEvent(question));
        }

        public virtual void RemoveQuestion(Question question, string modifiedBy)
        {
            ThrowIfQuestionIsInvalid(question);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var questions = GetOrderedQuestions();
            questions.Remove(question);
            DoUpdateQuestionsOrder(questions);

            QuestionsCollection.Remove(question);
            question.Objective = null;
            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionsDeletedEvent(this, new[] { question }));
        }

        public virtual void UpdateQuestionsOrder(ICollection<Question> questions, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNull(questions, "questions");

            DoUpdateQuestionsOrder(questions);
            MarkAsModified(modifiedBy);

            RaiseEvent(new QuestionsReorderedEvent(this));
        }

        public virtual IList<Question> OrderClonedQuestions(ICollection<Question> clonedQuestions)
        {
            if (clonedQuestions == null)
                return null;

            var originalQuestions = QuestionsCollection.ToList();

            if (originalQuestions.Count != clonedQuestions.Count)
            {
                throw new ArgumentException("Cloned questions collection has to be same length as original.", "clonedQuestions");
            }

            var orderedClonedQuestions = new List<Question>();
            foreach (var question in Questions)
            {
                int index = originalQuestions.IndexOf(question);
                orderedClonedQuestions.Add(clonedQuestions.ElementAt(index));
            }

            return orderedClonedQuestions;
        }

        private void DoUpdateQuestionsOrder(ICollection<Question> questions)
        {
            QuestionsOrder = questions.Count == 0 ? null : String.Join(",", questions.Select(i => i.Id).ToArray());
        }

        private ICollection<Question> GetOrderedQuestions()
        {
            if (String.IsNullOrEmpty(QuestionsOrder))
            {
                return QuestionsCollection.ToList();
            }

            var orderedQuestionIds = QuestionsOrder.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
            return QuestionsCollection.OrderBy(item => GetQuestionIndex(orderedQuestionIds, item)).ToList();
        }

        private int GetQuestionIndex(List<string> orderedQuestionIds, Question question)
        {
            var index = orderedQuestionIds.IndexOf(question.Id.ToString());
            return index > -1 ? index : orderedQuestionIds.Count;
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfImageUrlIsInvalid(string url)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(url, "imageUrl");
        }

        private void ThrowIfQuestionIsInvalid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }
    }
}
