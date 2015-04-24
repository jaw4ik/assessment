using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class BlankAnswerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Answer_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => BlankAnswerObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Answer_ShouldCreateAnswerInstance()
        {
            const string text = "text";
            Guid group = default(Guid);
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = BlankAnswerObjectMother.Create(text, true, group, CreatedBy);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
            answer.IsCorrect.Should().BeTrue();
            answer.GroupId.Should().Be(group);
            answer.Question.Should().BeNull();
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
            answer.CreatedBy.Should().Be(CreatedBy);
            answer.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

    }
}
