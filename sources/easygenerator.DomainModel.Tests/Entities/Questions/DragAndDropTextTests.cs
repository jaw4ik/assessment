using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class DragAndDropTextTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void DragAndDropText_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => DragAndDropTextObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void DragAndDropText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => DragAndDropTextObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void DragAndDropText_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => DragAndDropTextObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void DragAndDropText_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = DragAndDropTextObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Background.Should().BeNull();
            question.Dropspots.Should().BeEmpty();
            question.LearningContents.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Change background

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenBackgroundIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("background");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenBackgroundIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("background");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground("background", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground("background", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeBackground_ShouldChangeBackground()
        {
            const string background = "background";
            var question = DragAndDropTextObjectMother.Create();

            question.ChangeBackground(background, ModifiedBy);

            question.Background.Should().Be(background);
        }

        [TestMethod]
        public void ChangeBackground_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.ChangeBackground("background", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeBackground_ShouldUpdateMoidifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            const string user = "user";

            question.ChangeBackground("background", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeBackground_ShouldAddBackgroundChangedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();

            question.ChangeBackground("background", "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(QuestionBackgroundChangedEvent));
        }

        #endregion

        #region Update voice-over

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateVoiceOver()
        {
            const string voiceOver = "voiceOver";
            var question = DragAndDropTextObjectMother.Create();

            question.UpdateVoiceOver(voiceOver, ModifiedBy);

            question.VoiceOver.Should().Be(voiceOver);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateVoiceOver("voiceOver", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateMoidifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            var user = "Some user";

            question.UpdateVoiceOver("voice-over", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldAddQuestionVoiceOverUpdatedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();

            question.UpdateVoiceOver("voice-over", "user");

            question.Events.Should().ContainSingle(e => e.GetType() == typeof(QuestionVoiceOverUpdatedEvent));
        }

        #endregion

        #region Add dropspot

        [TestMethod]
        public void AddDropspot_ShouldThrowArgumentNullException_WhenDropspotIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.AddDropspot(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("dropspot");
        }

        [TestMethod]
        public void AddDropspot_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.AddDropspot(dropspot, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddDropspot_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.AddDropspot(dropspot, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddDropspot_ShouldAddDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.AddDropspot(dropspot, ModifiedBy);

            question.DropspotsCollection.Should().NotBeNull().And.HaveCount(1).And.Contain(dropspot);
        }

        [TestMethod]
        public void AddDropspot_ShouldSetQuestionToDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.AddDropspot(dropspot, ModifiedBy);

            dropspot.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddDropspot_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddDropspot(DropspotObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddDropspot_ShouldUpdateMoidifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            const string user = "user";

            question.AddDropspot(dropspot, user);

            question.ModifiedBy.Should().Be(user);
        }


        [TestMethod]
        public void AddDropspot_ShouldAddDropspotCreatedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.AddDropspot(dropspot, "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(DropspotCreatedEvent));
        }

        #endregion

        #region Remove dropspot

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentNullException_WhenDropspotIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.RemoveDropspot(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("dropspot");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.RemoveDropspot(dropspot, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.RemoveDropspot(dropspot, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldRemoveDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            question.DropspotsCollection = new Collection<Dropspot>() { dropspot };

            question.RemoveDropspot(dropspot, ModifiedBy);
            question.DropspotsCollection.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveDropspot_ShouldUnsetQuestionFromDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            dropspot.Question = question;

            question.RemoveDropspot(dropspot, ModifiedBy);

            dropspot.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveDropspot_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveDropspot(DropspotObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveDropspot_ShouldUpdateModifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            const string user = "user";

            question.RemoveDropspot(dropspot, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RemoveDropspot_ShouldAddCourseTitleUpdatedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.RemoveDropspot(dropspot, "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(DropspotDeletedEvent));
        }

        #endregion

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();
            var learningContent3 = LearningContentObjectMother.Create();

            var question = DragAndDropTextObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent.Id, learningContent3.Id);

            question.AddLearningContent(learningContent2, ModifiedBy);

            question.LearningContentsOrder.Should().Be(String.Format("{0},{1},{2}", learningContent.Id, learningContent3.Id, learningContent2.Id));
        }

        #endregion AddLearningContent

        #region RemoveLearningContent

        [TestMethod]
        public void RemoveLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();
            var learningContent3 = LearningContentObjectMother.Create();

            var question = DragAndDropTextObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent,
                learningContent2
            };
            question.LearningContentsOrder = String.Format("{0},{1},{2}", learningContent.Id, learningContent3.Id, learningContent2);

            question.RemoveLearningContent(learningContent2, ModifiedBy);

            question.LearningContentsOrder.Should().Be(String.Format("{0},{1}", learningContent.Id, learningContent3.Id));
        }

        #endregion RemoveLearningContent

        #region UpdateLearningContentsOrder

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldThrowArgumentNullException_WhenLearningContentsIsNull()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();

            //Act
            Action action = () => question.UpdateLearningContentsOrder(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("learningContents");
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();

            //Act
            Action action = () => question.UpdateLearningContentsOrder(new List<LearningContent>(), null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();

            //Act
            Action action = () => question.UpdateLearningContentsOrder(new List<LearningContent>(), "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldSetLearningContentsOrderToNull_WhenLearningContentsIsEmpty()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();

            //Act
            question.UpdateLearningContentsOrder(new List<LearningContent>(), ModifiedBy);

            //Assert
            question.LearningContentsOrder.Should().BeNull();
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldSetLearningContentsOrder()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();
            var learningContents = new List<LearningContent>()
            {
                LearningContentObjectMother.Create(),
                LearningContentObjectMother.Create()
            };

            question.LearningContentsCollection = learningContents;

            //Act
            question.UpdateLearningContentsOrder(learningContents, ModifiedBy);

            //Assert
            question.LearningContentsOrder.Should().Be(String.Format("{0},{1}", learningContents[0].Id, learningContents[1].Id));
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldAddLearningContentsReorderedEvent()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();

            //Act
            question.UpdateLearningContentsOrder(new List<LearningContent>(), ModifiedBy);

            //Assert
            question.Events.Should().ContainSingle(e => e.GetType() == typeof(LearningContentsReorderedEvent));
        }

        #endregion UpdateLearningContentsOrder

        #region LearningContents

        [TestMethod]
        public void LearningContents_ShouldReturnListOfLearningContentsInCorrectOrder()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent,
                learningContent2
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent2.Id, learningContent.Id);

            //Act
            var result = question.LearningContents;

            //Assert
            result.First().Should().Be(learningContent2);
        }

        [TestMethod]
        public void LearningContents_ShouldReturnAllLearningContents_WhenOrderedCollectionIsNotFull()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent,
                learningContent2
            };
            question.LearningContentsOrder = learningContent2.Id.ToString();

            //Act
            var result = question.LearningContents;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(learningContent2);
        }

        [TestMethod]
        public void LearningContents_ShouldReturnAllLearningContents_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var question = DragAndDropTextObjectMother.Create();
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

        #region OrderClonedLearningContents

        [TestMethod]
        public void OrderClonedLearningContents_ShouldReturnNull_IfClonedLearningContentsAreNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            var result = question.OrderClonedLearningContents(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedLearningContents_ShouldThrowArgumentException_IfLengthOfLearningContentsCollectionsAreDifferent()
        {
            var question = DragAndDropTextObjectMother.Create();
            Action action = () => question.OrderClonedLearningContents(new Collection<LearningContent> { LearningContentObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedLearningContents");
        }

        [TestMethod]
        public void OrderClonedLearningContents_ShouldOrderClonedLearningContentsAccordingToQuestionLearningContents()
        {
            var learningContent = LearningContentObjectMother.Create("learning content 1");
            var learningContent2 = LearningContentObjectMother.Create("learning content 2");
            var learningContent3 = LearningContentObjectMother.Create("learning content 3");

            var clonedLearningContent = LearningContentObjectMother.Create("cloned learning content 1");
            var clonedLearningContent2 = LearningContentObjectMother.Create("cloned learning content 2");
            var clonedLearningContent3 = LearningContentObjectMother.Create("cloned learning content 3");

            var question = DragAndDropTextObjectMother.Create();
            question.AddLearningContent(learningContent, "owner");
            question.AddLearningContent(learningContent2, "owner");
            question.AddLearningContent(learningContent3, "owner");

            question.UpdateLearningContentsOrder(new Collection<LearningContent> { learningContent3, learningContent, learningContent2 }, "owner");
            var result = question.OrderClonedLearningContents(new Collection<LearningContent> { clonedLearningContent, clonedLearningContent2, clonedLearningContent3 });

            result[0].Should().Be(clonedLearningContent3);
            result[1].Should().Be(clonedLearningContent);
            result[2].Should().Be(clonedLearningContent2);
        }
        #endregion 

    }
}
