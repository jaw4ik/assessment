﻿using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildCourse
{
    public interface ICourseBuilder
    {
        bool Build(Course course, bool includeMedia = false, bool enableAccessLimitation = false);
    }
}
