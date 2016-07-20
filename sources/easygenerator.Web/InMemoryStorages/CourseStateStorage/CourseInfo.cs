using easygenerator.Infrastructure;
using System;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public class CourseInfo
    {
        public DateTime BuildStartedOn { get; set; }
        public DateTime BuildForSaleStartedOn { get; set; }
        public DateTime ChangedOn { get; set; }
        public bool IsDirty { get; set; }
        public bool IsDirtyForSale { get; set; }

        public CourseInfo()
        {
            BuildStartedOn = DateTimeWrapper.MinValue();
            BuildForSaleStartedOn = DateTimeWrapper.MinValue();
            ChangedOn = DateTimeWrapper.MinValue();
            IsDirty = false;
            IsDirtyForSale = false;
        }
    }
}