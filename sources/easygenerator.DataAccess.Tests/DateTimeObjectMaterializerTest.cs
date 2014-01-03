﻿using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DataAccess.Tests
{
    [TestClass]
    public class DateTimeObjectMaterializerTest
    {
        [TestInitialize]
        public void Initialize()
        {
            DateTimeWrapper.Now = () => DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
        }

        #region Materialize

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForAnswer()
        {
            //Arrange
            var entity = AnswerObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForCourse()
        {
            //Arrange
            var entity = CourseObjectMother.Create();
            entity.UpdatePackageUrl("some url");
            entity.UpdatePublishedOnDate();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.BuildOn.HasValue.Should().Be(true);
            entity.PublishedOn.HasValue.Should().Be(true);
            entity.BuildOn.Value.Kind.Should().Be(DateTimeKind.Utc);
            entity.PublishedOn.Value.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForHelpHint()
        {
            //Arrange
            var entity = HelpHintObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForLearningContent()
        {
            //Arrange
            var entity = LearningContentObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForMailNotification()
        {
            //Arrange
            var entity = MailNotificationObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForObjective()
        {
            //Arrange
            var entity = ObjectiveObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForPasswordRecoveryTicket()
        {
            //Arrange
            var entity = PasswordRecoveryTicketObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForQuestion()
        {
            //Arrange
            var entity = QuestionObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForTemplate()
        {
            //Arrange
            var entity = TemplateObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Materialize_ShouldSetDateTimeKindToUtcForUser()
        {
            //Arrange
            var entity = UserObjectMother.Create();

            //Act
            DateTimeObjectMaterializer.Materialize(entity);

            //Assert
            entity.CreatedOn.Kind.Should().Be(DateTimeKind.Utc);
            entity.ModifiedOn.Kind.Should().Be(DateTimeKind.Utc);
        }

        #endregion
    }
}
