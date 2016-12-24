namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddQuestionShortIdsInfo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CourseQuestionShortIdsInfoes",
                c => new
                    {
                        Course_Id = c.Guid(nullable: false),
                        QuestionShortIds = c.String(),
                    })
                .PrimaryKey(t => t.Course_Id)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Course_Id);
            Sql("INSERT INTO CourseQuestionShortIdsInfoes (Course_Id, QuestionShortIds) SELECT Id, NULL FROM Courses ");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CourseQuestionShortIdsInfoes", "Course_Id", "dbo.Courses");
            DropIndex("dbo.CourseQuestionShortIdsInfoes", new[] { "Course_Id" });
            DropTable("dbo.CourseQuestionShortIdsInfoes");
        }
    }
}
