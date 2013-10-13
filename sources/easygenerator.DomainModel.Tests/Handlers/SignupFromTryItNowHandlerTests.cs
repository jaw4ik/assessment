using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.DomainModel.Tests.Handlers
{
    [TestClass]
    public class SignupFromTryItNowHandlerTests
    {
        const string TryItNowUsername = "username";
        const string SignUpUsername = "username@easygenerator.com";
        const string OtherExistingUser = "existinguser@easygenerator.com";

        private SignupFromTryItNowHandler _handler;

        private IQuerableRepository<Objective> _objectiveRepository;
        private IQuerableRepository<Question> _questionRepository;
        private IQuerableRepository<Answer> _answerRepository;
        private IQuerableRepository<LearningObject> _learningObjectRepository;
        private IQuerableRepository<Experience> _experienceRepository;

        [TestInitialize]
        public void InitializeContext()
        {
            _objectiveRepository = Substitute.For<IQuerableRepository<Objective>>();
            _questionRepository = Substitute.For<IQuerableRepository<Question>>();
            _answerRepository = Substitute.For<IQuerableRepository<Answer>>();
            _learningObjectRepository = Substitute.For<IQuerableRepository<LearningObject>>();
            _experienceRepository = Substitute.For<IQuerableRepository<Experience>>();

            _handler = new SignupFromTryItNowHandler(_experienceRepository, _objectiveRepository, _questionRepository, _answerRepository, _learningObjectRepository);
        }

        #region Experiences

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForExperiencesThatWereCreatedInTryMode()
        {
            var experience = Substitute.For<Experience>("title", Substitute.For<Template>(), TryItNowUsername);
            _experienceRepository.GetCollection().Returns(new List<Experience>() { experience });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            experience.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForExperiencesThatWereCreatedByOtherExistingUser()
        {
            var experience = Substitute.For<Experience>("title", Substitute.For<Template>(), OtherExistingUser);
            _experienceRepository.GetCollection().Returns(new List<Experience>() { experience });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            experience.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

        #region Objectives

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForObjectivesThatWereCreatedInTryMode()
        {
            var objective = Substitute.For<Objective>("title", TryItNowUsername);
            _objectiveRepository.GetCollection().Returns(new List<Objective>() { objective });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            objective.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForObjectivesThatWereCreatedByOtherExistingUser()
        {
            var objective = Substitute.For<Objective>("title", OtherExistingUser);
            _objectiveRepository.GetCollection().Returns(new List<Objective>() { objective });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            objective.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

        #region Questions

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForQuestionsThatWereCreatedInTryMode()
        {
            var question = Substitute.For<Question>("title", TryItNowUsername);
            _questionRepository.GetCollection().Returns(new List<Question>() { question });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            question.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForQuestionsThatWereCreatedByOtherExistingUser()
        {
            var question = Substitute.For<Question>("title", OtherExistingUser);
            _questionRepository.GetCollection().Returns(new List<Question>() { question });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            question.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

        #region Answers

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForAnswersThatWereCreatedInTryMode()
        {
            var answer = Substitute.For<Answer>("text", true, TryItNowUsername);
            _answerRepository.GetCollection().Returns(new List<Answer>() { answer });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            answer.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForAnswersThatWereCreatedByOtherExistingUser()
        {
            var answer = Substitute.For<Answer>("text", true, OtherExistingUser);
            _answerRepository.GetCollection().Returns(new List<Answer>() { answer });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            answer.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

        #region Learning objects

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForLearningObjectsThatWereCreatedInTryMode()
        {
            var learningObject = Substitute.For<LearningObject>("text", TryItNowUsername);
            _learningObjectRepository.GetCollection().Returns(new List<LearningObject>() { learningObject });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            learningObject.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForLearningObjectsThatWereCreatedByOtherExistingUser()
        {
            var learningObject = Substitute.For<LearningObject>("text", OtherExistingUser);
            _learningObjectRepository.GetCollection().Returns(new List<LearningObject>() { learningObject });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            learningObject.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion
    }
}
