namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCourseStatesTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CourseStates",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        HasUnpublishedChanges = c.Boolean(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Course_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CourseStates", "Course_Id", "dbo.Courses");
            DropIndex("dbo.CourseStates", new[] { "Course_Id" });
            DropTable("dbo.CourseStates");
        }
    }
}
