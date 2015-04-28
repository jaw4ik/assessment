namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDefaultCourseTemplateSettingsWithDisabledLRS : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO CourseTemplateSettings " +
                "SELECT NEWID(), '{ \"logo\": {\"url\":\"\"}, \"xApi\": { \"enabled\": false, \"lrs\": { \"credentials\": {} } } }', c.CreatedBy, GETDATE(), c.ModifiedBy, GETDATE(), c.Template_Id, c.Id, NULL " +
                "FROM Courses c " +
                "LEFT JOIN CourseTemplateSettings cts " +
                "ON c.Id = cts.Course_Id AND c.Template_Id = cts.Template_Id " +
                "WHERE c.BuildOn IS NOT NULL AND cts.Id IS NULL");
        }
        
        public override void Down()
        {
        }
    }
}
