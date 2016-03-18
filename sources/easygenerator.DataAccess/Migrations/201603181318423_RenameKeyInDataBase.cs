namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameKeyInDataBase : DbMigration
    {
        public override void Up()
        {
            Sql("EXEC sp_rename '[FK_dbo.CourseObjectives_dbo.Courses_Course_Id]', 'FK_dbo.CourseSections_dbo.Courses_Course_Id', 'OBJECT';" +
                "EXEC sp_rename '[FK_dbo.CourseObjectives_dbo.Objectives_Objective_Id]', 'FK_dbo.CourseSections_dbo.Sections_Section_Id', 'OBJECT';" +
                "EXEC sp_rename '[FK_dbo.Questions_dbo.Objectives_Objective_Id]', 'FK_dbo.Questions_dbo.Sections_Section_Id', 'OBJECT'; ");
        }
        
        public override void Down()
        {
            Sql("EXEC sp_rename '[FK_dbo.CourseSections_dbo.Courses_Course_Id]', 'FK_dbo.CourseObjectives_dbo.Courses_Course_Id', 'OBJECT';" +
                "EXEC sp_rename '[FK_dbo.CourseSections_dbo.Sections_Section_Id]', 'FK_dbo.CourseObjectives_dbo.Objectives_Objective_Id', 'OBJECT';" +
                "EXEC sp_rename '[FK_dbo.Questions_dbo.Sections_Section_Id]', 'FK_dbo.Questions_dbo.Objectives_Objective_Id', 'OBJECT';");
        }
    }
}
