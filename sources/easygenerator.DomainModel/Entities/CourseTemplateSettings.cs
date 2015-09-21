using System;
using easygenerator.DomainModel.Entities;

public class CourseTemplateSettings : Entity
{
    public CourseTemplateSettings()
    {

    }

    public CourseTemplateSettings(string createdBy)
        : base(createdBy)
    {

    }

    public Guid Course_Id { get; set; }
    public Guid Template_Id { get; set; }
    public virtual Course Course { get; set; }
    public virtual Template Template { get; set; }
    public string Settings { get; set; }
    public string ExtraData { get; set; }
}