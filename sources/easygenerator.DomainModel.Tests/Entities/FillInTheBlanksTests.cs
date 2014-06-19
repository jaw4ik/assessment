using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class FillInTheBlanksTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";

        #region UpdateAnswers

        [TestMethod]
        public void UpdateAnswers_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answers = new Collection<Answer>();

            Action action = () => question.UpdateAnswers(answers, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateAnswers_ShouldUpdateReplaceAnswerCollection()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answers = new Collection<Answer>() { AnswerObjectMother.Create(), AnswerObjectMother.Create() };

            question.UpdateAnswers(answers, ModifiedBy);

            question.Answers.ToList().Count.Should().Be(2);
        }

        [TestMethod]
        public void UpdateAnswers_ShouldUpdateMoidifiedBy()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answers = new Collection<Answer>();

            question.UpdateAnswers(answers, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        #endregion
    }
}
