using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.ObjectModel;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.DomainModel.Tests.Utils;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class HotSpotTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void HotSpot_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => HotSpotObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void HotSpot_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => HotSpotObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void HotSpot_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => HotSpotObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void HotSpot_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = HotSpotObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Background.Should().BeNull();
            question.HotSpotPolygons.Should().BeEmpty();
            question.LearningContents.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update voice-over

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateVoiceOver()
        {
            const string voiceOver = "voiceOver";
            var question = HotSpotObjectMother.Create();

            question.UpdateVoiceOver(voiceOver, ModifiedBy);

            question.VoiceOver.Should().Be(voiceOver);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = HotSpotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateVoiceOver("voiceOver", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateMoidifiedBy()
        {
            var question = HotSpotObjectMother.Create();
            var user = "Some user";

            question.UpdateVoiceOver("voice-over", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldAddQuestionVoiceOverUpdatedEvent()
        {
            var question = HotSpotObjectMother.Create();

            question.UpdateVoiceOver("voice-over", "user");

            question.ShouldContainSingleEvent<QuestionVoiceOverUpdatedEvent>();
        }

        #endregion

        #region Change background

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenBackgroundIsNull()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.ChangeBackground(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("background");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenBackgroundIsEmpty()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.ChangeBackground(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("background");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.ChangeBackground("background", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.ChangeBackground("background", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeBackground_ShouldChangeBackground()
        {
            const string background = "background";
            var question = HotSpotObjectMother.Create();

            question.ChangeBackground(background, ModifiedBy);

            question.Background.Should().Be(background);
        }

        [TestMethod]
        public void ChangeBackground_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = HotSpotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.ChangeBackground("background", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeBackground_ShouldUpdateMoidifiedBy()
        {
            var question = HotSpotObjectMother.Create();
            const string user = "user";

            question.ChangeBackground("background", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeBackground_ShouldAddBackgroundChangedEvent()
        {
            var question = HotSpotObjectMother.Create();

            question.ChangeBackground("background", "username");

            question.ShouldContainSingleEvent<QuestionBackgroundChangedEvent>();
        }

        #endregion

        #region Add HotSpotPolygon

        [TestMethod]
        public void AddHotSpotPolygon_ShouldThrowArgumentNullException_WhenHotSpotPolygonIsNull()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.AddHotSpotPolygon(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("hotSpotPolygon");
        }

        [TestMethod]
        public void AddHotSpotPolygon_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => question.AddHotSpotPolygon(polygon, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddHotSpotPolygon_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => question.AddHotSpotPolygon(polygon, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddHotSpotPolygon_ShouldAddHotSpotPolygon()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            question.AddHotSpotPolygon(polygon, ModifiedBy);

            question.HotSpotPolygons.Should().NotBeNull().And.HaveCount(1).And.Contain(polygon);
        }

        [TestMethod]
        public void AddHotSpotPolygon_ShouldSetQuestionToHotSpotPolygon()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            question.AddHotSpotPolygon(polygon, ModifiedBy);

            polygon.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddHotSpotPolygon_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = HotSpotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddHotSpotPolygon(HotSpotPolygonObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddHotSpotPolygon_ShouldUpdateMoidifiedBy()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();
            const string user = "user";

            question.AddHotSpotPolygon(polygon, user);

            question.ModifiedBy.Should().Be(user);
        }


        [TestMethod]
        public void AddHotSpotPolygon_ShouldAddHotSpotPolygonCreatedEvent()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            question.AddHotSpotPolygon(polygon, "username");

            question.ShouldContainSingleEvent<HotSpotPolygonCreatedEvent>();
        }

        #endregion

        #region Remove HotSpotPolygon

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldThrowArgumentNullException_WhenHotSpotPolygonIsNull()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.RemoveHotSpotPolygon(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("hotSpotPolygon");
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => question.RemoveHotSpotPolygon(polygon, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => question.RemoveHotSpotPolygon(polygon, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldRemoveHotSpotPolygon()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();
            question.HotSpotPolygonsCollection = new Collection<HotSpotPolygon>() { polygon };

            question.RemoveHotSpotPolygon(polygon, ModifiedBy);
            question.HotSpotPolygonsCollection.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldUnsetQuestionFromHotSpotPolygon()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();
            polygon.Question = question;

            question.RemoveHotSpotPolygon(polygon, ModifiedBy);

            polygon.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = HotSpotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveHotSpotPolygon(HotSpotPolygonObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldUpdateModifiedBy()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();
            const string user = "user";

            question.RemoveHotSpotPolygon(polygon, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RemoveHotSpotPolygon_ShouldAddHotSpotPolygonDeletedEvent()
        {
            var question = HotSpotObjectMother.Create();
            var polygon = HotSpotPolygonObjectMother.Create();

            question.RemoveHotSpotPolygon(polygon, "username");

            question.ShouldContainSingleEvent<HotSpotPolygonDeletedEvent>();
        }

        #endregion

        #region Change type

        [TestMethod]
        public void ChangeType_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.ChangeType(false, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeType_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = HotSpotObjectMother.Create();

            Action action = () => question.ChangeType(false, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeType_ShouldChangeType()
        {
            var question = HotSpotObjectMother.Create();

            question.ChangeType(true, ModifiedBy);

            question.IsMultiple.Should().Be(true);
        }

        [TestMethod]
        public void ChangeType_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = HotSpotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.ChangeType(true, ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeType_ShouldUpdateMoidifiedBy()
        {
            var question = HotSpotObjectMother.Create();
            const string user = "user";

            question.ChangeType(true, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeType_ShouldAddBackgroundChangedEvent()
        {
            var question = HotSpotObjectMother.Create();

            question.ChangeType(true, "username");

            question.ShouldContainSingleEvent<HotSpotIsMultipleChangedEvent>();
        }

        #endregion

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = HotSpotObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent
            };

            question.AddLearningContent(learningContent2, ModifiedBy);

            question.LearningContents.ElementAt(0).Should().Be(learningContent);
            question.LearningContents.ElementAt(1).Should().Be(learningContent2);
            question.LearningContents.ElementAt(2).Should().Be(learningContent3);
        }

        #endregion AddLearningContent

        #region RemoveLearningContent

        [TestMethod]
        public void RemoveLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = HotSpotObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent,
                learningContent2,
                learningContent3
            };

            question.RemoveLearningContent(learningContent2, ModifiedBy);
            question.LearningContents.ElementAt(0).Should().Be(learningContent);
            question.LearningContents.ElementAt(1).Should().Be(learningContent3);
        }

        #endregion RemoveLearningContent

        #region LearningContents

        [TestMethod]
        public void LearningContents_ShouldReturnListOfLearningContentsInCorrectOrder()
        {
            //Arrange
            var question = HotSpotObjectMother.Create();
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent2,
                learningContent
            };

            //Assert
            question.LearningContents.ElementAt(0).Should().Be(learningContent);
            question.LearningContents.ElementAt(1).Should().Be(learningContent2);
        }

        [TestMethod]
        public void LearningContents_ShouldReturnAllLearningContents_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var question = HotSpotObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent2.Id, learningContent.Id);
            ;

            //Act
            var result = question.LearningContents;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(learningContent);
        }

        #endregion
    }
}
