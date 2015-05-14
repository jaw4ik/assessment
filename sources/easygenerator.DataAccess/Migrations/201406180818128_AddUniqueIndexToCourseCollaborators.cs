namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddUniqueIndexToCourseCollaborators : DbMigration
    {
        public override void Up()
        {
            
            CreateIndex("dbo.CourseCollaborators", new[] { "Course_Id", "Email" }, true, "UQ_Course_Id_Email");
        }

        public override void Down()
        {
            DropIndex("dbo.CourseCollaborators", "UQ_Course_Id_Email");
        }
    }
}
