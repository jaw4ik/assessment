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
        private readonly IQuerableRepository<Course> _courseRepository;
        private readonly IQuerableRepository<Objective> _objectiveRepository;
        private readonly IQuerableRepository<Question> _qustionRepository;
        private readonly IQuerableRepository<Answer> _answerRepository;
        private readonly IQuerableRepository<LearningContent> _learningContentRepository;
        private readonly IHelpHintRepository _helpHintRepository;
        private readonly IImageFileRepository _imageFileRepository;

        public SignupFromTryItNowHandler(IQuerableRepository<Course> courseRepository,
            IQuerableRepository<Objective> objectiveRepository,
            IQuerableRepository<Question> qustionRepository,
            IQuerableRepository<Answer> answerRepository,
            IQuerableRepository<LearningContent> learningContentRepository,
            IHelpHintRepository helpHintRepository,
            IImageFileRepository imageFileRepository)
        {
            _courseRepository = courseRepository;
            _objectiveRepository = objectiveRepository;
            _qustionRepository = qustionRepository;
            _answerRepository = answerRepository;
            _learningContentRepository = learningContentRepository;
            _helpHintRepository = helpHintRepository;
            _imageFileRepository = imageFileRepository;
        }

        public void HandleOwnership(string tryItNowUsername, string signUpUsername)
        {
            foreach (var course in _courseRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                course.DefineCreatedBy(signUpUsername);
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

            foreach (var imageFile in _imageFileRepository.GetCollection().Where(e => e.CreatedBy == tryItNowUsername))
            {
                imageFile.DefineCreatedBy(signUpUsername);
            }
        }
    }
}