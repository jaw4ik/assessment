﻿using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.BuildExperience.BuildModel
{
    public class LearningObjectBuildModel
    {
        [Required(AllowEmptyStrings = false)]
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Text { get; set; }
    }
}
