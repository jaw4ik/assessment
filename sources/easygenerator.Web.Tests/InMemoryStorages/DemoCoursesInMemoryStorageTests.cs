using System;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.InMemoryStorages;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Tests.InMemoryStorages
{
    [TestClass]
    public class DemoCoursesInMemoryStorageTests
    {
        private DemoCoursesInMemoryStorage demoCourseStorage;
        private IDemoCourseInfoRepository _demoCourseInfoRepository;

        [TestInitialize]
        public void Initialize()
        {
            _demoCourseInfoRepository = Substitute.For<IDemoCourseInfoRepository>();
            demoCourseStorage = new DemoCoursesInMemoryStorage(_demoCourseInfoRepository);
        }

        [TestMethod]
        public void InitializeShould_FillDemoCoursesInfoCollection()
        {
            DateTimeWrapper.Now = () => DateTime.Now.AddMonths(1);
            var demoCourseInfo1 = DemoCourseInfoObjectMother.Create();

            DateTimeWrapper.Now = () => DateTime.Now;
            var demoCourseInfo2 = DemoCourseInfoObjectMother.Create();

            _demoCourseInfoRepository.GetCollection().Returns(new[] { demoCourseInfo1, demoCourseInfo2 });

            demoCourseStorage.Initialize();

            demoCourseStorage.DemoCoursesInfo.ElementAt(0).Should().Be(demoCourseInfo2);
            demoCourseStorage.DemoCoursesInfo.ElementAt(1).Should().Be(demoCourseInfo1);
        }

        [TestMethod]
        public void AddDemoCourseInfo_Should_AddDemoCourseInfo()
        {
            _demoCourseInfoRepository.GetCollection().Returns(new DemoCourseInfo[] { });
            demoCourseStorage.Initialize();

            var demoCourseInfo = DemoCourseInfoObjectMother.Create();
            demoCourseStorage.AddDemoCourseInfo(demoCourseInfo);

            demoCourseStorage.DemoCoursesInfo.ElementAt(0).Should().Be(demoCourseInfo);
        }

        [TestMethod]
        public void RemoveDemoCourseInfo_Should_RemoveDemoCourseInfo()
        {
            var demoCourseInfo = DemoCourseInfoObjectMother.Create();
            var demoCourseInfo1 = DemoCourseInfoObjectMother.Create();
            _demoCourseInfoRepository.GetCollection().Returns(new[] { demoCourseInfo, demoCourseInfo1 });
            demoCourseStorage.Initialize();

            demoCourseStorage.RemoveDemoCourseInfo(demoCourseInfo);

            demoCourseStorage.DemoCoursesInfo.Count().Should().Be(1);
            demoCourseStorage.DemoCoursesInfo.ElementAt(0).Should().Be(demoCourseInfo1);
        }

        [TestMethod]
        public void UpdateDemoCourseInfo_Should_UpdateDemoCourseInfo()
        {
            var demoCourseInfo = DemoCourseInfoObjectMother.Create();
            var demoCourse = CourseObjectMother.Create();

            _demoCourseInfoRepository.GetCollection().Returns(new[] { demoCourseInfo });
            demoCourseStorage.Initialize();
            demoCourseInfo.UpdateDemoCourse(demoCourse, "modifier");

            demoCourseStorage.UpdateDemoCourseInfo(demoCourseInfo);

            demoCourseStorage.DemoCoursesInfo.ElementAt(0).DemoCourse.Should().Be(demoCourse);
            demoCourseStorage.DemoCoursesInfo.ElementAt(0).ModifiedBy.Should().Be("modifier");
        }

        [TestMethod]
        public void DemoCoursesInfo_Should_ReturnOrderedDemoCourseInfos()
        {
            DateTimeWrapper.Now = () => DateTime.Now.AddMonths(2);
            var demoCourseInfo1 = DemoCourseInfoObjectMother.Create();

            DateTimeWrapper.Now = () => DateTime.Now.AddMonths(1);
            var demoCourseInfo2 = DemoCourseInfoObjectMother.Create();

            _demoCourseInfoRepository.GetCollection().Returns(new[] { demoCourseInfo1, demoCourseInfo2 });

            demoCourseStorage.Initialize();

            DateTimeWrapper.Now = () => DateTime.Now;
            var demoCourseInfo3 = DemoCourseInfoObjectMother.Create();

            demoCourseStorage.AddDemoCourseInfo(demoCourseInfo3);

            demoCourseStorage.DemoCoursesInfo.ElementAt(0).Should().Be(demoCourseInfo3);
            demoCourseStorage.DemoCoursesInfo.ElementAt(1).Should().Be(demoCourseInfo2);
            demoCourseStorage.DemoCoursesInfo.ElementAt(2).Should().Be(demoCourseInfo1);
        }

        [TestMethod]
        public void DemoCourses_Should_ReturnOrderedDemoCourses()
        {
            DateTimeWrapper.Now = () => DateTime.Now.AddMonths(2);
            var demoCourseInfo1 = DemoCourseInfoObjectMother.Create();

            DateTimeWrapper.Now = () => DateTime.Now.AddMonths(1);
            var demoCourseInfo2 = DemoCourseInfoObjectMother.Create();

            _demoCourseInfoRepository.GetCollection().Returns(new[] { demoCourseInfo1, demoCourseInfo2 });

            demoCourseStorage.Initialize();

            DateTimeWrapper.Now = () => DateTime.Now;
            var demoCourseInfo3 = DemoCourseInfoObjectMother.Create();

            demoCourseStorage.AddDemoCourseInfo(demoCourseInfo3);

            demoCourseStorage.DemoCourses.ElementAt(0).Should().Be(demoCourseInfo3.DemoCourse);
            demoCourseStorage.DemoCourses.ElementAt(1).Should().Be(demoCourseInfo2.DemoCourse);
            demoCourseStorage.DemoCourses.ElementAt(2).Should().Be(demoCourseInfo1.DemoCourse);
        }

    }
}
