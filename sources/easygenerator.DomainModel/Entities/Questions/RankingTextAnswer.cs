 using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
 using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class RankingTextAnswer : Entity
    {
        protected internal RankingTextAnswer() { }

        protected internal RankingTextAnswer(string text, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);
            Text = text;
        }
        protected internal RankingTextAnswer(string text, string createdBy, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            ThrowIfTextIsInvalid(text);
            Text = text;
        }
        public virtual RankingText Question { get; internal set; }
        public string Text { get; private set; }
        public virtual void UpdateText(string text, string modifiedBy)
        {
            ThrowIfTextIsInvalid(text);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Text = text;

            MarkAsModified(modifiedBy);

            RaiseEvent(new RankingTextAnswerTextChangedEvent(this));
        }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNull(text, "text");
        }
    }
}
