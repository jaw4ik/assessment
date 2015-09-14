namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUniqueIndexForCourseTemplateSettings : DbMigration
    {
        public override void Up()
        {
            Sql("WITH cte AS (SELECT ROW_NUMBER() OVER (PARTITION BY Course_Id, Template_Id ORDER BY (SELECT 0)) RN FROM dbo.CourseTemplateSettings) DELETE FROM cte WHERE  RN > 1");
            DropIndex("dbo.CourseTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Course_Id" });
            CreateIndex("dbo.CourseTemplateSettings", "Course_Id");
            CreateIndex("dbo.CourseTemplateSettings", new[] { "Course_Id", "Template_Id" }, unique: true, name: "UI_CourseTemplateSettings_Course_Id_Template_Id");
            CreateIndex("dbo.CourseTemplateSettings", "Template_Id");
        }
        
        public override void Down()
        {
            DropIndex("dbo.CourseTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.CourseTemplateSettings", "UI_CourseTemplateSettings_Course_Id_Template_Id");
            DropIndex("dbo.CourseTemplateSettings", new[] { "Course_Id" });
            CreateIndex("dbo.CourseTemplateSettings", "Course_Id");
            CreateIndex("dbo.CourseTemplateSettings", "Template_Id");
        }
    }
}
