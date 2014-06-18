using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class FillInTheBlankUpdatedEvent: QuestionEvent
    {
        public ICollection<Answer> Answers { get; private set; }

        public FillInTheBlankUpdatedEvent(Question question, ICollection<Answer> answers)
            : base(question)
        {
            ThrowIfAnswersIsInvalid(answers);

            Answers = answers;
        }

        private void ThrowIfAnswersIsInvalid(ICollection<Answer> answers)
        {
            ArgumentValidation.ThrowIfNull(answers, "answers");
        }
    }
}
