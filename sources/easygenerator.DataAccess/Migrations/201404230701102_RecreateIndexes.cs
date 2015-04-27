namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class RecreateIndexes : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.CourseObjectives", new[] { "Objective_Id" });
            DropIndex("dbo.CourseObjectives", new[] { "Course_Id" });
            DropIndex("dbo.PasswordRecoveryTickets", new[] { "User_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Course_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.Comments", new[] { "Course_Id" });
            DropIndex("dbo.Aim4YouIntegration", new[] { "Id" });
            DropIndex("dbo.Courses", new[] { "Template_Id" });
            DropIndex("dbo.LearningContents", new[] { "Question_Id" });
            DropIndex("dbo.Questions", new[] { "Objective_Id" });
            DropIndex("dbo.Answers", new[] { "Question_Id" });

            CreateIndex("dbo.Answers", "Question_Id");
            CreateIndex("dbo.Questions", "Objective_Id");
            CreateIndex("dbo.LearningContents", "Question_Id");
            CreateIndex("dbo.Courses", "Template_Id");
            CreateIndex("dbo.Aim4YouIntegration", "Id");
            CreateIndex("dbo.Comments", "Course_Id");
            CreateIndex("dbo.CourseTemplateSettings", "Template_Id");
            CreateIndex("dbo.CourseTemplateSettings", "Course_Id");
            CreateIndex("dbo.PasswordRecoveryTickets", "User_Id");
            CreateIndex("dbo.CourseObjectives", "Course_Id");
            CreateIndex("dbo.CourseObjectives", "Objective_Id");
        }

        public override void Down()
        {
            DropIndex("dbo.CourseObjectives", new[] { "Objective_Id" });
            DropIndex("dbo.CourseObjectives", new[] { "Course_Id" });
            DropIndex("dbo.PasswordRecoveryTickets", new[] { "User_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Course_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.Comments", new[] { "Course_Id" });
            DropIndex("dbo.Aim4YouIntegration", new[] { "Id" });
            DropIndex("dbo.Courses", new[] { "Template_Id" });
            DropIndex("dbo.LearningContents", new[] { "Question_Id" });
            DropIndex("dbo.Questions", new[] { "Objective_Id" });
            DropIndex("dbo.Answers", new[] { "Question_Id" });
        }
    }
}
