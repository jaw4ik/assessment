using System;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.PublishedCourse.EntityReaders
{
    [TestClass]
    public class AnswerEntityReaderTests
    {
        private AnswerEntityReader _answerEntityReader;
        private IEntityFactory _entityFactory;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();

            _entityFactory.Answer(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>())
                .Returns(info =>
                    AnswerObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<bool>(),
                        info.Args().ElementAt(2).As<string>()));

            _entityFactory.BlankAnswer(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<Guid>(), Arg.Any<string>())
                .Returns(info =>
                    BlankAnswerObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<bool>(),
                        info.Args().ElementAt(2).As<Guid>(),
                        info.Args().ElementAt(3).As<string>()));


            _entityFactory.Dropspot(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>())
                .Returns(info =>
                    DropspotObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<int>(),
                        info.Args().ElementAt(2).As<int>(),
                        info.Args().ElementAt(3).As<string>()));

            _answerEntityReader = new AnswerEntityReader(_entityFactory);
        }

        #region ReadAnswer

        [TestMethod]
        public void ReadAnswer_ShouldReadAnswerFromPublishedPackage()
        {
            //Arrange
            Guid answerId = Guid.NewGuid();
            string answerText = "adasdgsghdfghdgjgfkhjkhg";
            bool answerCorrectness = true;
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                        String.Format("{{ objectives: [ {{ questions: [ {{ answers: [ {{ id: '{0}', text: '{1}', isCorrect: {2} }} ] }} ] }} ] }}",
                            answerId.ToString("N").ToLower(), answerText, answerCorrectness.ToString().ToLower()));

            //Act
            var answer = _answerEntityReader.ReadAnswer(answerId, createdBy, courseData);

            //Assert
            answer.Text.Should().Be(answerText);
            answer.IsCorrect.Should().Be(answerCorrectness);
            answer.CreatedBy.Should().Be(createdBy);
        }

        #endregion

        #region ReadBlankAnswer

        [TestMethod]
        public void ReadBlankAnswer_ShouldReadAnswerFromPublishedPackage()
        {
            //Arrange
            Guid answerId = Guid.NewGuid();
            string answerText = "adasdgsghdfghdgjgfkhjkhg";
            bool answerCorrectness = true;
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                        String.Format("{{ objectives: [ {{ questions: [ {{ answers: [ {{ id: '{0}', text: '{1}', isCorrect: {2}, groupId: '{3}' }} ] }} ] }} ] }}",
                            answerId.ToString("N").ToLower(), answerText, answerCorrectness.ToString().ToLower(), Guid.Empty.ToString("N").ToLower()));

            //Act
            var answer = _answerEntityReader.ReadBlankAnswer(answerId, createdBy, courseData);

            //Assert
            answer.Text.Should().Be(answerText);
            answer.IsCorrect.Should().Be(answerCorrectness);
            answer.CreatedBy.Should().Be(createdBy);
        }

        #endregion

        #region ReadGropspot

        [TestMethod]
        public void ReadDropspot_ShouldReadDropspotFromPublishedPackage()
        {
            //Arrange
            Guid answerId = Guid.NewGuid();
            string answerText = "adasdgsghdfghdgjgfkhjkhg";
            int x = 0;
            int y = 1;
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                        String.Format("{{ objectives: [ {{ questions: [ {{ dropspots: [ {{ id: '{0}', text: '{1}', x: {2}, y: {3}, group: '{4}' }} ] }} ] }} ] }}",
                            answerId.ToString("N").ToLower(), answerText, x, y, Guid.Empty.ToString("N").ToLower()));

            //Act
            var dropspot = _answerEntityReader.ReadDropspot(answerId, createdBy, courseData);

            //Assert
            dropspot.Text.Should().Be(answerText);
            dropspot.X.Should().Be(x);
            dropspot.Y.Should().Be(y);
            dropspot.CreatedBy.Should().Be(createdBy);
        }

        #endregion

    }
}
