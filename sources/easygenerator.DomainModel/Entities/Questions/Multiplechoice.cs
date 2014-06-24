using System.Linq;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Multiplechoice : Multipleselect
    {
        public Multiplechoice() { }

        public Multiplechoice(string title, string createdBy)
            : base(title, createdBy)
        {
        }

        public virtual void SetCorrectAnswer(Answer correctAnswer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(correctAnswer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            correctAnswer.UpdateCorrectness(true, modifiedBy);

            var answers = Answers.Where(a => a != correctAnswer && a.IsCorrect);
            foreach (var answer in answers)
            {
                answer.UpdateCorrectness(false, modifiedBy);
            }

            MarkAsModified(modifiedBy);
        }

        public override void RemoveAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Remove(answer);
            answer.Question = null;

            if (answer.IsCorrect)
            {
                var firstAnswer = AnswersCollection.OrderBy(a => a.CreatedOn).FirstOrDefault();
                if (firstAnswer != null)
                {
                    firstAnswer.UpdateCorrectness(true, modifiedBy);
                }
            }

            MarkAsModified(modifiedBy);
        }
    }
}
