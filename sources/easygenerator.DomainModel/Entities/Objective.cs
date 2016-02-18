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

        public string LearningObjective { get; private set; }

        public virtual void UpdateLearningObjective(string learningObjective, string modifiedBy)
        {
            ThrowIfLearningObjectiveIsInvalid(learningObjective);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LearningObjective = learningObjective;
            MarkAsModified(modifiedBy);

            RaiseEvent(new ObjectiveLearningObjectiveUpdatedEvent(this));
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
            QuestionsOrder = OrderingUtils.GetOrder(questions);
        }

        private ICollection<Question> GetOrderedQuestions()
        {
            return OrderingUtils.OrderCollection(QuestionsCollection, QuestionsOrder);
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

        private void ThrowIfLearningObjectiveIsInvalid(string learningObjective)
        {
            ArgumentValidation.ThrowIfLongerThan255(learningObjective, "Learning objective");
        }

        private void ThrowIfQuestionIsInvalid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }
    }
}
