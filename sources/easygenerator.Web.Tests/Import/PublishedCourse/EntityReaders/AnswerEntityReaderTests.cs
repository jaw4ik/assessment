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

            _entityFactory.Answer(Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<Guid>(), Arg.Any<string>())
                .Returns(info =>
                    AnswerObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<bool>(),
                        info.Args().ElementAt(2).As<Guid>(),
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
                        String.Format("{{ objectives: [ {{ questions: [ {{ answers: [ {{ id: '{0}', text: '{1}', isCorrect: {2}, group: '{3}' }} ] }} ] }} ] }}",
                            answerId.ToString("N").ToLower(), answerText, answerCorrectness.ToString().ToLower(), Guid.Empty.ToString("N").ToLower()));

            //Act
            var answer = _answerEntityReader.ReadAnswer(answerId, createdBy, courseData);

            //Assert
            answer.Text.Should().Be(answerText);
            answer.IsCorrect.Should().Be(answerCorrectness);
            answer.CreatedBy.Should().Be(createdBy);
        }

        #endregion

    }
}
