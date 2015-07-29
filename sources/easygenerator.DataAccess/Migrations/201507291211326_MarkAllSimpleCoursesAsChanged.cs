namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MarkAllSimpleCoursesAsChanged : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.CourseStates SET isDirty=1 WHERE Course_Id in (SELECT Id FROM dbo.Courses WHERE Template_Id = (SELECT Id FROM dbo.Templates WHERE Name='Simple course'))");
            Sql("INSERT INTO dbo.CourseStates SELECT NEWID(), 1, Id FROM (SELECT Id FROM dbo.Courses WHERE PublicationUrl is not NULL and Template_Id = (SELECT Id FROM dbo.Templates WHERE Name = 'Simple course') EXCEPT SELECT Course_Id FROM dbo.CourseStates) as PublishedSimpleCourses");
        }
        
        public override void Down()
        {
        }
    }
}
