using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
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
        private IQuerableRepository<Dropspot> _dropspotRepository;
        private IQuerableRepository<TextMatchingAnswer> _textMatchingAnswerRepository;
        private IQuerableRepository<LearningContent> _learningContentRepository;
        private IQuerableRepository<Course> _courseRepository;
        private IImageFileRepository _imageFileRepository;

        [TestInitialize]
        public void InitializeContext()
        {
            _objectiveRepository = Substitute.For<IQuerableRepository<Objective>>();
            _questionRepository = Substitute.For<IQuerableRepository<Question>>();
            _answerRepository = Substitute.For<IQuerableRepository<Answer>>();
            _dropspotRepository = Substitute.For<IQuerableRepository<Dropspot>>();
            _textMatchingAnswerRepository = Substitute.For<IQuerableRepository<TextMatchingAnswer>>();
            _learningContentRepository = Substitute.For<IQuerableRepository<LearningContent>>();
            _courseRepository = Substitute.For<IQuerableRepository<Course>>();
            _imageFileRepository = Substitute.For<IImageFileRepository>();

            _handler = new SignupFromTryItNowHandler(_courseRepository, _objectiveRepository, _questionRepository, _answerRepository, _dropspotRepository, _textMatchingAnswerRepository, _learningContentRepository, _imageFileRepository);
        }

        #region Courses

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForCoursesThatWereCreatedInTryMode()
        {
            var course = Substitute.For<Course>("title", Substitute.For<Template>(), TryItNowUsername);
            _courseRepository.GetCollection(Arg.Any<Expression<Func<Course, bool>>>()).Returns(new List<Course>() { course });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            course.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForCoursesThatWereCreatedByOtherExistingUser()
        {
            var course = Substitute.For<Course>("title", Substitute.For<Template>(), OtherExistingUser);
            _courseRepository.GetCollection().Returns(new List<Course>() { course });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            course.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

        #region Objectives

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForObjectivesThatWereCreatedInTryMode()
        {
            var objective = Substitute.For<Objective>("title", TryItNowUsername);
            _objectiveRepository.GetCollection(Arg.Any<Expression<Func<Objective, bool>>>()).Returns(new List<Objective>() { objective });

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
            _questionRepository.GetCollection(Arg.Any<Expression<Func<Question, bool>>>()).Returns(new List<Question>() { question });

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
            _answerRepository.GetCollection(Arg.Any<Expression<Func<Answer, bool>>>()).Returns(new List<Answer>() { answer });

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

        #region Dropspots


        [TestMethod]
        public void Handle_ShouldDefineCreatedByForDropspotsThatWereCreatedInTryMode()
        {
            var dropspot = Substitute.For<Dropspot>("text", 0, 0, TryItNowUsername);
            _dropspotRepository.GetCollection(Arg.Any<Expression<Func<Dropspot, bool>>>()).Returns(new List<Dropspot>() { dropspot });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            dropspot.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForDropspotsThatWereCreatedByOtherExistingUser()
        {
            var dropspot = Substitute.For<Dropspot>("text", 0, 0, OtherExistingUser);
            _dropspotRepository.GetCollection().Returns(new List<Dropspot>() { dropspot });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            dropspot.DidNotReceive().DefineCreatedBy(SignUpUsername);
        }

        #endregion

        #region TextMatchingAnswer


        [TestMethod]
        public void Handle_ShouldDefineCreatedByForTextMatchingAnswersThatWereCreatedInTryMode()
        {
            var answer = Substitute.For<TextMatchingAnswer>("key", "value", OtherExistingUser);
            _textMatchingAnswerRepository.GetCollection(Arg.Any<Expression<Func<TextMatchingAnswer, bool>>>()).Returns(new List<TextMatchingAnswer>() { answer });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            answer.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForTextMatchingAnswersThatWereCreatedByOtherExistingUser()
        {
            var answer = Substitute.For<TextMatchingAnswer>("key", "value", OtherExistingUser);
            _textMatchingAnswerRepository.GetCollection().Returns(new List<TextMatchingAnswer>() { answer });

            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            answer.DidNotReceive().DefineCreatedBy(SignUpUsername);
        }

        #endregion

        #region Learning content

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForLearningContentsThatWereCreatedInTryMode()
        {
            var learningContent = Substitute.For<LearningContent>("text", TryItNowUsername);
            _learningContentRepository.GetCollection(Arg.Any<Expression<Func<LearningContent, bool>>>()).Returns(new List<LearningContent>() { learningContent });

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

        #region Image files

        [TestMethod]
        public void Handle_ShouldDefineCreatedByForImageFilesThatWereCreatedInTryMode()
        {
            //Arrange
            var imageFile = Substitute.For<ImageFile>("image.jpg", TryItNowUsername);
            _imageFileRepository.GetCollection(Arg.Any<Expression<Func<ImageFile, bool>>>()).Returns(new List<ImageFile>() { imageFile });

            //Action
            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            //Assert
            imageFile.Received().DefineCreatedBy(SignUpUsername);
        }

        [TestMethod]
        public void Handle_ShouldNotDefineCreatedByForImageFilesThatWereCreatedByOtherUser()
        {
            //Arrange
            var imageFile = Substitute.For<ImageFile>("image.jpg", OtherExistingUser);
            _imageFileRepository.GetCollection().Returns(new List<ImageFile>() { imageFile });

            //Action
            _handler.HandleOwnership(TryItNowUsername, SignUpUsername);

            //Assert
            imageFile.DidNotReceive().DefineCreatedBy(Arg.Any<string>());
        }

        #endregion

    }
}
