using System.Reflection;
using System.Runtime.InteropServices;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute;

namespace easygenerator.Web.Tests.DataAccess
{
    [TestClass]
    public class DateTimeKindMaterializerTest
    {
        public class DateClass
        {
            public DateTime Date1 { get; set; }
            public DateTime Date2 { get; set; }
        }

        private DateClass _entity;

        [TestInitialize]
        public void Initialize()
        {
            _entity = Substitute.For<DateClass>();
        }

        #region [Apply]

        [TestMethod]
        public void Apply_ShouldThrowArgumentNullException_WhenInputEntityIsNull()
        {
            Action action = () => DateTimeKindMaterializer.Apply(null, DateTimeKind.Utc);

            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void Apply_ShouldSetUtcKindForAllDateTimeProperties_WhenInputKindIsUtc()
        {
            _entity.Date1 = DateTime.SpecifyKind(_entity.Date1, DateTimeKind.Unspecified);
            _entity.Date2 = DateTime.SpecifyKind(_entity.Date2, DateTimeKind.Local);

            DateTimeKindMaterializer.Apply(_entity, DateTimeKind.Utc);

            _entity.Date1.Kind.Should().Be(DateTimeKind.Utc);
            _entity.Date2.Kind.Should().Be(DateTimeKind.Utc);
        }

        [TestMethod]
        public void Apply_ShouldSetUnspecifiedKindForAllDateTimeProperties_WhenInputKindIsUnspecified()
        {
            _entity.Date1 = DateTime.SpecifyKind(_entity.Date1, DateTimeKind.Utc);
            _entity.Date2 = DateTime.SpecifyKind(_entity.Date2, DateTimeKind.Local);

            DateTimeKindMaterializer.Apply(_entity, DateTimeKind.Unspecified);

            _entity.Date1.Kind.Should().Be(DateTimeKind.Unspecified);
            _entity.Date2.Kind.Should().Be(DateTimeKind.Unspecified);
        }

        [TestMethod]
        public void Apply_ShouldSetLocalKindForAllDateTimeProperties_WhenInputKindIsLocal()
        {
            _entity.Date1 = DateTime.SpecifyKind(_entity.Date1, DateTimeKind.Utc);
            _entity.Date2 = DateTime.SpecifyKind(_entity.Date2, DateTimeKind.Unspecified);

            DateTimeKindMaterializer.Apply(_entity, DateTimeKind.Local);

            _entity.Date1.Kind.Should().Be(DateTimeKind.Local);
            _entity.Date2.Kind.Should().Be(DateTimeKind.Local);
        }

        #endregion
    }
}
