using System;
using System.Linq;
using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.Web.ViewModels.DemoCourses
{
    public class DemoCoursesViewModel
    {
        public IEnumerable<CourseInfoViewModel> DemoCoursesInfo { get; private set; }
        public IEnumerable<CourseInfoViewModel> UserCourses { get; private set; }

        public DemoCoursesViewModel(IEnumerable<DemoCourseInfo> demoCoursesInfo, IEnumerable<Course> courses)
        {
            DemoCoursesInfo = demoCoursesInfo.Select(demoCourseInfo => new CourseInfoViewModel { Id = demoCourseInfo.Id, Title = demoCourseInfo.DemoCourse.Title });
            UserCourses = courses.Select(course => new CourseInfoViewModel { Id = course.Id, Title = course.Title });
        }

        public class CourseInfoViewModel
        {
            public string Title { get; set; }
            public Guid Id { get; set; }
        }
    }
}