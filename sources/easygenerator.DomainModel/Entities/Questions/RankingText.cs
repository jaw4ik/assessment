using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class RankingText : Question
    {
        public RankingText() { }

        public RankingText(string title, string createdBy)
            : base(title, createdBy)
        {
            AnswersCollection = new Collection<RankingTextAnswer>();
        }

        public RankingText(string title, string createdBy, RankingTextAnswer answer1, RankingTextAnswer answer2)
            : this(title, createdBy)
        {
            ThrowIfAnswerIsInvalid(answer1);
            ThrowIfAnswerIsInvalid(answer2);

            AnswersCollection.Add(answer1);
            AnswersCollection.Add(answer2);
        }

        protected internal virtual ICollection<RankingTextAnswer> AnswersCollection { get; set; }
        public IEnumerable<RankingTextAnswer> Answers => GetOrderedAnswers().AsEnumerable();

        protected internal string AnswersOrder { get; set; }

        public virtual void UpdateAnswersOrder(ICollection<RankingTextAnswer> answers, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNull(answers, "answers");

            DoUpdateAnswersOrder(answers);
            MarkAsModified(modifiedBy);

            RaiseEvent(new RankingTextAnswersReorderedEvent(this, answers));
        }

        public void AddAnswer(RankingTextAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!AnswersCollection.Contains(answer))
            {
                var answers = GetOrderedAnswers();
                answers.Add(answer);
                DoUpdateAnswersOrder(answers);

                AnswersCollection.Add(answer);
                answer.Question = this;
            }

            MarkAsModified(modifiedBy);

            RaiseEvent(new RankingTextAnswerCreatedEvent(answer));
        }

        public void DeleteAnswer(RankingTextAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            var answers = GetOrderedAnswers();
            answers.Remove(answer);
            DoUpdateAnswersOrder(answers);

            AnswersCollection.Remove(answer);
            answer.Question = null;
            MarkAsModified(modifiedBy);

            RaiseEvent(new RankingTextAnswerDeletedEvent(this, answer));
        }

        private void DoUpdateAnswersOrder(ICollection<RankingTextAnswer> answers)
        {
            AnswersOrder = OrderingUtils.GetOrder(answers);
        }

        private ICollection<RankingTextAnswer> GetOrderedAnswers()
        {
            return OrderingUtils.OrderCollection(AnswersCollection, AnswersOrder);
        }

        private void ThrowIfAnswerIsInvalid(RankingTextAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
