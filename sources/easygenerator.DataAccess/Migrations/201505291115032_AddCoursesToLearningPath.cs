namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCoursesToLearningPath : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LearningPathCourses",
                c => new
                    {
                        LearningPath_Id = c.Guid(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.LearningPath_Id, t.Course_Id })
                .ForeignKey("dbo.LearningPaths", t => t.LearningPath_Id, cascadeDelete: true)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.LearningPath_Id)
                .Index(t => t.Course_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LearningPathCourses", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.LearningPathCourses", "LearningPath_Id", "dbo.LearningPaths");
            DropIndex("dbo.LearningPathCourses", new[] { "Course_Id" });
            DropIndex("dbo.LearningPathCourses", new[] { "LearningPath_Id" });
            DropTable("dbo.LearningPathCourses");
        }
    }
}
