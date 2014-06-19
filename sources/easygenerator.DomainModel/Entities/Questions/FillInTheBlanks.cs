using System.Collections.Generic;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class FillInTheBlanks : Multipleselect
    {
        public FillInTheBlanks()
        {

        }

        public FillInTheBlanks(string title, string createdBy)
            : base(title, createdBy)
        {
        }

        public virtual void UpdateAnswers(ICollection<Answer> answers, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            foreach (var answer in AnswersCollection)
            {
                answer.Question = null;
            }
            AnswersCollection = answers;

            MarkAsModified(modifiedBy);
        }
    }
}
