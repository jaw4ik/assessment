namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FixEntitiesCustomColumnsLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Answers", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Answers", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Questions", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Questions", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Objectives", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Objectives", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.LearningContents", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.LearningContents", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Dropspots", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Dropspots", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Courses", "PackageUrl", c => c.String(maxLength: 255));
            AlterColumn("dbo.Courses", "ScormPackageUrl", c => c.String(maxLength: 255));
            AlterColumn("dbo.Courses", "PublicationUrl", c => c.String(maxLength: 255));
            AlterColumn("dbo.Courses", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Courses", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.CourseCollaborators", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.CourseCollaborators", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Comments", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Comments", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Templates", "Name", c => c.String(nullable: false, maxLength: 255));
            AlterColumn("dbo.Templates", "Image", c => c.String(nullable: false, maxLength: 255));
            AlterColumn("dbo.Templates", "PreviewUrl", c => c.String(maxLength: 255));
            AlterColumn("dbo.Templates", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Templates", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.CourseTemplateSettings", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.CourseTemplateSettings", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Users", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.Users", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.ImageFiles", "CreatedBy", c => c.String(nullable: false, maxLength: 254));
            AlterColumn("dbo.ImageFiles", "ModifiedBy", c => c.String(nullable: false, maxLength: 254));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ImageFiles", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.ImageFiles", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Users", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Users", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.CourseTemplateSettings", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.CourseTemplateSettings", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Templates", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Templates", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Templates", "PreviewUrl", c => c.String());
            AlterColumn("dbo.Templates", "Image", c => c.String(nullable: false));
            AlterColumn("dbo.Templates", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.Comments", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Comments", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.CourseCollaborators", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.CourseCollaborators", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Courses", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Courses", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Courses", "PublicationUrl", c => c.String());
            AlterColumn("dbo.Courses", "ScormPackageUrl", c => c.String());
            AlterColumn("dbo.Courses", "PackageUrl", c => c.String());
            AlterColumn("dbo.Dropspots", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Dropspots", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.LearningContents", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.LearningContents", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Objectives", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Objectives", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Questions", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Questions", "CreatedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Answers", "ModifiedBy", c => c.String(nullable: false));
            AlterColumn("dbo.Answers", "CreatedBy", c => c.String(nullable: false));
        }
    }
}
