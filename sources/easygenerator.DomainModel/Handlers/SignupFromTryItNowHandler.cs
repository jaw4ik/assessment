using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
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
        private readonly IQuerableRepository<Dropspot> _dropspotRepository;
        private readonly IQuerableRepository<TextMatchingAnswer> _textMatchingAnswerRepository;
        private readonly IQuerableRepository<LearningContent> _learningContentRepository;
        private readonly IImageFileRepository _imageFileRepository;

        public SignupFromTryItNowHandler(IQuerableRepository<Course> courseRepository,
            IQuerableRepository<Objective> objectiveRepository,
            IQuerableRepository<Question> qustionRepository,
            IQuerableRepository<Answer> answerRepository,
            IQuerableRepository<Dropspot> dropspotRepository,
            IQuerableRepository<TextMatchingAnswer> textMatchingAnswerRepository,
            IQuerableRepository<LearningContent> learningContentRepository,
            IImageFileRepository imageFileRepository)
        {
            _courseRepository = courseRepository;
            _objectiveRepository = objectiveRepository;
            _qustionRepository = qustionRepository;
            _answerRepository = answerRepository;
            _dropspotRepository = dropspotRepository;
            _textMatchingAnswerRepository = textMatchingAnswerRepository;
            _learningContentRepository = learningContentRepository;
            _imageFileRepository = imageFileRepository;
        }

        public void HandleOwnership(string tryItNowUsername, string signUpUsername)
        {
            foreach (var course in _courseRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                course.DefineCreatedBy(signUpUsername);
            }

            foreach (var objective in _objectiveRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                objective.DefineCreatedBy(signUpUsername);
            }

            foreach (var question in _qustionRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                question.DefineCreatedBy(signUpUsername);
            }

            foreach (var answer in _answerRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                answer.DefineCreatedBy(signUpUsername);
            }

            foreach (var dropspot in _dropspotRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                dropspot.DefineCreatedBy(signUpUsername);
            }

            foreach (var textMatchingAnswer in _textMatchingAnswerRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                textMatchingAnswer.DefineCreatedBy(signUpUsername);
            }

            foreach (var learningContent in _learningContentRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                learningContent.DefineCreatedBy(signUpUsername);
            }

            foreach (var imageFile in _imageFileRepository.GetCollection(e => e.CreatedBy == tryItNowUsername))
            {
                imageFile.DefineCreatedBy(signUpUsername);
            }
        }
    }
}