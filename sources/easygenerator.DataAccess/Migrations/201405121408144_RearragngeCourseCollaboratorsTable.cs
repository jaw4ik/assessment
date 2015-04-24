namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class RearragngeCourseCollaboratorsTable : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.SharedCourses", "User_Id", "dbo.Users");
            DropForeignKey("dbo.SharedCourses", "Course_Id", "dbo.Courses");
            DropIndex("dbo.SharedCourses", new[] { "User_Id" });
            DropIndex("dbo.SharedCourses", new[] { "Course_Id" });
            CreateTable(
                "dbo.CourseCollabrators",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        User_Id = c.Guid(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.User_Id)
                .Index(t => t.Course_Id);
            
            DropTable("dbo.SharedCourses");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.SharedCourses",
                c => new
                    {
                        User_Id = c.Guid(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.User_Id, t.Course_Id });
            
            DropForeignKey("dbo.CourseCollabrators", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.CourseCollabrators", "User_Id", "dbo.Users");
            DropIndex("dbo.CourseCollabrators", new[] { "Course_Id" });
            DropIndex("dbo.CourseCollabrators", new[] { "User_Id" });
            DropTable("dbo.CourseCollabrators");
            CreateIndex("dbo.SharedCourses", "Course_Id");
            CreateIndex("dbo.SharedCourses", "User_Id");
            AddForeignKey("dbo.SharedCourses", "Course_Id", "dbo.Courses", "Id", cascadeDelete: true);
            AddForeignKey("dbo.SharedCourses", "User_Id", "dbo.Users", "Id", cascadeDelete: true);
        }
    }
}
