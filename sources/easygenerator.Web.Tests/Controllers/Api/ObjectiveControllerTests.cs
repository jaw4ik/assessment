using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Security.PermissionsCheckers;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class SectionControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string ModifiedBy = "easygenerator2@easygenerator.com";

        private SectionController _controller;

        IEntityFactory _entityFactory;
        ISectionRepository _repository;
        IPrincipal _user;
        HttpContextBase _context;
        IEntityMapper _entityMapper;
        IUrlHelperWrapper _urlHelper;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<ISectionRepository>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _controller = new SectionController(_repository, _entityFactory, _entityMapper, _urlHelper);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Section>(new List<Section>() { SectionObjectMother.Create() });

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Create section

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            var section = SectionObjectMother.Create();
            _entityFactory.Section(null, CreatedBy).ReturnsForAnyArgs(section);

            var result = _controller.Create(null);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new
                {
                    Id = section.Id.ToNString(),
                    ImageUrl = String.IsNullOrEmpty(section.ImageUrl) ? _urlHelper.ToAbsoluteUrl(Constants.Section.DefaultImageUrl) : section.ImageUrl,
                    CreatedOn = section.CreatedOn,
                    CreatedBy = section.CreatedBy
                });
        }

        [TestMethod]
        public void Create_ShouldAddSection()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var section = SectionObjectMother.CreateWithTitle(title);
            _entityFactory.Section(title, user).Returns(section);

            _controller.Create(title);

            _repository.Received().Add(Arg.Is<Section>(obj => obj.Title == title));
        }


        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldReturnJsonErrorResult_WhenSectionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }


        [TestMethod]
        public void UpdateTitle_ShouldUpdateSectionTitle()
        {
            const string title = "updated title";
            _user.Identity.Name.Returns(ModifiedBy);
            var section = Substitute.For<Section>("Some title", CreatedBy);

            _controller.UpdateTitle(section, title);

            section.Received().UpdateTitle(title, ModifiedBy);
        }

        [TestMethod]
        public void UpdateTitle_ShouldReturnJsonSuccessResult()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);

            var result = _controller.UpdateTitle(section, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = section.ModifiedOn });
        }

        #endregion

        #region Update learning objective

        [TestMethod]
        public void UpdateLearningObjective_ShouldReturnJsonErrorResult_WhenSectionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateLearningObjective(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }


        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateSectionLearningObjective()
        {
            const string lo = "updated learning section";
            _user.Identity.Name.Returns(ModifiedBy);
            var section = Substitute.For<Section>("Some title", CreatedBy);

            _controller.UpdateLearningObjective(section, lo);

            section.Received().UpdateLearningObjective(lo, ModifiedBy);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldReturnJsonSuccessResult()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);

            var result = _controller.UpdateLearningObjective(section, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = section.ModifiedOn });
        }

        #endregion

        #region Update image

        [TestMethod]
        public void UpdateImage_ShouldReturnJsonErrorResult_WhenSectionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateImage(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }


        [TestMethod]
        public void UpdateImage_ShouldUpdateSectionImageUrl()
        {
            const string imageUrl = "new/image/url";
            _user.Identity.Name.Returns(ModifiedBy);
            var section = Substitute.For<Section>("Some title", CreatedBy);

            _controller.UpdateImage(section, imageUrl);

            section.Received().UpdateImageUrl(imageUrl, ModifiedBy);
        }

        [TestMethod]
        public void UpdateImage_ShouldReturnJsonSuccessResult()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);

            var result = _controller.UpdateImage(section, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = section.ModifiedOn });
        }

        #endregion

        #region Delete section

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);

            var result = _controller.Delete(section);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveSection_WhenItNotNull()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);

            _controller.Delete(section);

            _repository.Received().Remove(section);
        }

        [TestMethod]
        public void Delete_ShouldRemoveQuestionsInSection_WhenItNotNull()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);
            var question = Substitute.For<Question>();
            var questions = new Collection<Question>();
            questions.Add(question);
            section.Questions.Returns(questions);

            _controller.Delete(section);

            section.Received().RemoveQuestion(question, Arg.Any<string>());
        }

        [TestMethod]
        public void Delete_ReturnJsonSuccessResult_WhenSectionIsNull()
        {
            var result = _controller.Delete(null);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ReturnJsonErrorResult_WhenSectionIsInCourse()
        {
            var course = Substitute.For<Course>();
            var courses = new List<Course>() { course };

            var section = Substitute.For<Section>("Some title", CreatedBy);
            section.Courses.Returns(courses);

            var result = _controller.Delete(section);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section can not be deleted");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionCannnotBeDeleted");
        }

        #endregion

        #region UpdateQuestionsOrder

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldReturnHttpNotFoundResult_WhenSectionIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateQuestionsOrder(null, new Collection<Question>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.SectionNotFoundError);
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldCallUpdateQuestionsForSection()
        {
            //Arrange
            var section = Substitute.For<Section>();
            var questions = new Collection<Question>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            _controller.UpdateQuestionsOrder(section, questions);

            //Assert
            section.Received().UpdateQuestionsOrder(questions, ModifiedBy);
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var section = Substitute.For<Section>();
            var questions = new Collection<Question>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            var result = _controller.UpdateQuestionsOrder(section, questions);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = section.ModifiedOn });
        }

        #endregion

        #region PermanentlyDeleteSection

        [TestMethod]
        public void PermanentlyDeleteSection_ShouldReturnHttpNotFoundResult_WhenSectionIsNull()
        {
            var result = _controller.PermanentlyDeleteSection(null);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.SectionNotFoundError);

        }

        [TestMethod]
        public void PermanentlyDeleteSection_ShouldUnrelateThisSectionFromAllCourses()
        {
            var course = Substitute.For<Course>();
            var course1 = Substitute.For<Course>();
            var section = Substitute.For<Section>("Some title", CreatedBy);
            var courses = new Collection<Course>();
            course.RelateSection(section, 0, CreatedBy);
            course1.RelateSection(section, 0, CreatedBy);
            courses.Add(course);
            courses.Add(course1);

            section.Courses.Returns(courses);

            _controller.PermanentlyDeleteSection(section);

            course.Received().UnrelateSection(section, Arg.Any<string>());
            course1.Received().UnrelateSection(section, Arg.Any<string>());
        }

        [TestMethod]
        public void PermanentlyDeleteSection_ShouldRemoveQuestionsInSection_WhenItNotNull()
        {
            var section = Substitute.For<Section>("Some title", CreatedBy);
            var question = Substitute.For<Question>();
            var questions = new Collection<Question>();
            questions.Add(question);
            section.Questions.Returns(questions);

            _controller.PermanentlyDeleteSection(section);

            section.Received().RemoveQuestion(question, Arg.Any<string>());
        }

        [TestMethod]
        public void PermanentlyDeleteSection_ShouldRemoveSection_WhenItNotNull()
        {
            var course = Substitute.For<Course>();
            var course1 = Substitute.For<Course>();
            var section = Substitute.For<Section>("Some title", CreatedBy);
            var courses = new Collection<Course>();
            course.RelateSection(section, 0, CreatedBy);
            course1.RelateSection(section, 0, CreatedBy);
            courses.Add(course);
            courses.Add(course1);

            section.Courses.Returns(courses);

            _controller.PermanentlyDeleteSection(section);

            _repository.Received().Remove(section);
        }

        [TestMethod]
        public void PermanentlyDeleteSection_ReturnJsonSuccessResult_WhenSectionIsNull()
        {
            var course = Substitute.For<Course>();
            var course1 = Substitute.For<Course>();
            var section = Substitute.For<Section>("Some title", CreatedBy);
            var courses = new Collection<Course>();
            course.RelateSection(section, 0, CreatedBy);
            course1.RelateSection(section, 0, CreatedBy);
            courses.Add(course);
            courses.Add(course1);

            section.Courses.Returns(courses);

            var result = _controller.PermanentlyDeleteSection(section);

            result.Should().BeJsonSuccessResult();
        }

        #endregion PermanentlyDeleteSection
    }
}
