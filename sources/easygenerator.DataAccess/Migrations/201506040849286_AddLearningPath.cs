namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLearningPath : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LearningPaths",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(nullable: false, maxLength: 255),
                        CoursesOrder = c.String(),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.LearningPathCourses",
                c => new
                    {
                        Course_Id = c.Guid(nullable: false),
                        LearningPath_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Course_Id, t.LearningPath_Id })
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .ForeignKey("dbo.LearningPaths", t => t.LearningPath_Id, cascadeDelete: true)
                .Index(t => t.Course_Id)
                .Index(t => t.LearningPath_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LearningPathCourses", "LearningPath_Id", "dbo.LearningPaths");
            DropForeignKey("dbo.LearningPathCourses", "Course_Id", "dbo.Courses");
            DropIndex("dbo.LearningPathCourses", new[] { "LearningPath_Id" });
            DropIndex("dbo.LearningPathCourses", new[] { "Course_Id" });
            DropTable("dbo.LearningPathCourses");
            DropTable("dbo.LearningPaths");
        }
    }
}
