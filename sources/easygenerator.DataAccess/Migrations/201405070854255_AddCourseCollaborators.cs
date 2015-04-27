namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCourseCollaborators : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SharedCourses",
                c => new
                    {
                        User_Id = c.Guid(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.User_Id, t.Course_Id })
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.User_Id)
                .Index(t => t.Course_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SharedCourses", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.SharedCourses", "User_Id", "dbo.Users");
            DropIndex("dbo.SharedCourses", new[] { "Course_Id" });
            DropIndex("dbo.SharedCourses", new[] { "User_Id" });
            DropTable("dbo.SharedCourses");
        }
    }
}
