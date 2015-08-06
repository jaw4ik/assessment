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

    public virtual Course Course { get; set; }
    public virtual Template Template { get; set; }
    public string Settings { get; set; }
    public string ExtraData { get; set; }
}