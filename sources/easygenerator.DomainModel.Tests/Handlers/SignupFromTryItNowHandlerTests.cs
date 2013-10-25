﻿using System.Collections.Generic;
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
        private IQuerableRepository<LearningContent> _learningContentRepository;
        private IQuerableRepository<Experience> _experienceRepository;
        private IHelpHintRepository _helpHintRepository;

        [TestInitialize]
        public void InitializeContext()
        {
            _objectiveRepository = Substitute.For<IQuerableRepository<Objective>>();
            _questionRepository = Substitute.For<IQuerableRepository<Question>>();
            _answerRepository = Substitute.For<IQuerableRepository<Answer>>();
            _learningContentRepository = Substitute.For<IQuerableRepository<LearningContent>>();
            _experienceRepository = Substitute.For<IQuerableRepository<Experience>>();
            _helpHintRepository = Substitute.For<IHelpHintRepository>();

            _handler = new SignupFromTryItNowHandler(_experienceRepository, _objectiveRepository, _questionRepository, _answerRepository, _learningContentRepository, _helpHintRepository);
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

        #region Learning content

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForLearningContentsThatWereCreatedInTryMode()
        {
            var learningContent = Substitute.For<LearningContent>("text", TryItNowUsername);
            _learningContentRepository.GetCollection().Returns(new List<LearningContent>() { learningContent });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            learningContent.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForLearningContentsThatWereCreatedByOtherExistingUser()
        {
            var learningContent = Substitute.For<LearningContent>("text", OtherExistingUser);
            _learningContentRepository.GetCollection().Returns(new List<LearningContent>() { learningContent });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            learningContent.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

        #region Help hints

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForHelpHintsThatWereCreatedInTryMode()
        {
            var helpHint = Substitute.For<HelpHint>("objectives", TryItNowUsername);
            _helpHintRepository.GetHelpHintsForUser(TryItNowUsername).Returns(new List<HelpHint>() { helpHint });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            helpHint.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForHelpHintsThatWereCreatedByOtherExistingUser()
        {
            var helpHint = Substitute.For<HelpHint>("objectives", OtherExistingUser);
            _helpHintRepository.GetHelpHintsForUser(OtherExistingUser).Returns(new List<HelpHint>() { helpHint });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            helpHint.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion
    }
}
