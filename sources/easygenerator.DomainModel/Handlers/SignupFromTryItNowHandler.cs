using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DomainModel.Handlers
{
    public interface ISignupFromTryItNowHandler
    {
        void HandleOwnership(string tryItNowUsername, string signUpUsername);
    }

    public class SignupFromTryItNowHandler : ISignupFromTryItNowHandler
    {
        private readonly IQuerableRepository<Experience> _experienceRepository;
        private readonly IQuerableRepository<Objective> _objectiveRepository;
        private readonly IQuerableRepository<Question> _qustionRepository;
        private readonly IQuerableRepository<Answer> _answerRepository;
        private readonly IQuerableRepository<LearningContent> _learningContentRepository;
        private readonly IHelpHintRepository _helpHintRepository;

        public SignupFromTryItNowHandler(IQuerableRepository<Experience> experienceRepository,
            IQuerableRepository<Objective> objectiveRepository,
            IQuerableRepository<Question> qustionRepository,
            IQuerableRepository<Answer> answerRepository,
            IQuerableRepository<LearningContent> learningContentRepository,
            IHelpHintRepository helpHintRepository)
        {
            _experienceRepository = experienceRepository;
            _objectiveRepository = objectiveRepository;
            _qustionRepository = qustionRepository;
            _answerRepository = answerRepository;
            _learningContentRepository = learningContentRepository;
            _helpHintRepository = helpHintRepository;
        }

        public void HandleOwnership(string tryItNowUsername, string signUpUsername)
        {
            foreach (var experience in _experienceRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                experience.DefineCreatedBy(signUpUsername);
            }

            foreach (var objective in _objectiveRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                objective.DefineCreatedBy(signUpUsername);
            }

            foreach (var question in _qustionRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                question.DefineCreatedBy(signUpUsername);
            }

            foreach (var answer in _answerRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                answer.DefineCreatedBy(signUpUsername);
            }

            foreach (var learningContent in _learningContentRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                learningContent.DefineCreatedBy(signUpUsername);
            }

            foreach (var helpHint in _helpHintRepository.GetHelpHintsForUser(tryItNowUsername))
            {
                helpHint.DefineCreatedBy(signUpUsername);
            }
        }
    }
}