using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents
{
    public class RankingTextAnswersReorderedEvent : QuestionEvent
    {
        public ICollection<RankingTextAnswer> Answers { get; private set; }

        public RankingTextAnswersReorderedEvent(Question question, ICollection<RankingTextAnswer> answers)
            : base(question)
        {
            ThrowIfAnswersIsInvalid(answers);
            Answers = answers;
        }

        private void ThrowIfAnswersIsInvalid(ICollection<RankingTextAnswer> answers)
        {
            ArgumentValidation.ThrowIfNull(answers, "answers");
        }
    }
}
