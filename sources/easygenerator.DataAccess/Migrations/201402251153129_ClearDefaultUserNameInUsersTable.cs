namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ClearDefaultUserNameInUsersTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Objectives",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Title = c.String(nullable: false, maxLength: 255),
                    QuestionsOrder = c.String(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.Courses",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    ObjectivesOrder = c.String(),
                    Title = c.String(nullable: false, maxLength: 255),
                    BuildOn = c.DateTime(),
                    PackageUrl = c.String(),
                    IntroductionContent = c.String(),
                    ScormPackageUrl = c.String(),
                    PublishedOn = c.DateTime(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Template_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id)
                .Index(t => t.Template_Id);

            CreateTable(
                "dbo.Templates",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Name = c.String(nullable: false),
                    Image = c.String(nullable: false),
                    Description = c.String(nullable: false),
                    PreviewUrl = c.String(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            Sql("INSERT INTO dbo.Templates VALUES(NEWID(), 'Simple course', '/Content/images/simpleCourseTemplate.png', 'Use this when you want a course style like setup.', '/Templates/Simple course/', 'Some user', GETDATE(), 'Some user', GETDATE())");
            Sql("INSERT INTO dbo.Templates VALUES(NEWID(), 'Quiz', '/Content/images/quizTemplate.png', 'Use this when you want to create an assessment.', '/Templates/Quiz/', 'Some user', GETDATE(), 'Some user', GETDATE())");

            CreateTable(
                "dbo.Questions",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Title = c.String(nullable: false, maxLength: 255),
                    Content = c.String(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Objective_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Objectives", t => t.Objective_Id, cascadeDelete: true)
                .Index(t => t.Objective_Id);

            CreateTable(
                "dbo.Answers",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Text = c.String(nullable: false),
                    IsCorrect = c.Boolean(nullable: false),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Question_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);

            CreateTable(
                "dbo.LearningContents",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Text = c.String(nullable: false),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Question_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);

            CreateTable(
                "dbo.Users",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Email = c.String(nullable: false, maxLength: 254),
                    PasswordHash = c.String(nullable: false),
                    FirstName = c.String(nullable: false),
                    LastName = c.String(nullable: false),
                    Phone = c.String(nullable: false),
                    Organization = c.String(nullable: false),
                    Country = c.String(nullable: false),
                    AccessType = c.Int(nullable: false),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            Sql("ALTER TABLE Users ADD CONSTRAINT UQ_Email UNIQUE (Email)");

            CreateTable(
                "dbo.PasswordRecoveryTickets",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    User_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.User_Id);

            CreateTable(
                "dbo.HelpHints",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Name = c.String(nullable: false, maxLength: 254),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.MailNotifications",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Subject = c.String(nullable: false, maxLength: 254),
                    ToEmailAddresses = c.String(nullable: false, maxLength: 511),
                    CCEmailAddresses = c.String(maxLength: 511),
                    BCCEmailAddresses = c.String(maxLength: 511),
                    FromEmailAddress = c.String(nullable: false, maxLength: 127),
                    Body = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.CourseObjectives",
                c => new
                {
                    Course_Id = c.Guid(nullable: false),
                    Objective_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => new { t.Course_Id, t.Objective_Id })
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .ForeignKey("dbo.Objectives", t => t.Objective_Id, cascadeDelete: true)
                .Index(t => t.Course_Id)
                .Index(t => t.Objective_Id);


            CreateTable(
                "dbo.Comments",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Text = c.String(nullable: false),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Course_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Course_Id);

            CreateTable(
                "dbo.CourseTemplateSettings",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Settings = c.String(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Template_Id = c.Guid(nullable: false),
                    Course_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Template_Id)
                .Index(t => t.Course_Id);

            CreateTable(
                "dbo.UserSettings",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    IsShowIntroductionPage = c.Boolean(nullable: false),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Id)
                .Index(t => t.Id);

            CreateTable(
                "dbo.ImageFiles",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Title = c.String(nullable: false, maxLength: 255),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                })
                .PrimaryKey(t => t.Id);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserSettings", "Id", "dbo.Users");
            DropForeignKey("dbo.PasswordRecoveryTickets", "User_Id", "dbo.Users");
            DropForeignKey("dbo.CourseTemplateSettings", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.CourseTemplateSettings", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.Courses", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.CourseObjectives", "Objective_Id", "dbo.Objectives");
            DropForeignKey("dbo.CourseObjectives", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.Comments", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.Questions", "Objective_Id", "dbo.Objectives");
            DropForeignKey("dbo.LearningContents", "Question_Id", "dbo.Questions");
            DropForeignKey("dbo.Answers", "Question_Id", "dbo.Questions");
            DropIndex("dbo.UserSettings", new[] { "Id" });
            DropIndex("dbo.PasswordRecoveryTickets", new[] { "User_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Course_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.Courses", new[] { "Template_Id" });
            DropIndex("dbo.CourseObjectives", new[] { "Objective_Id" });
            DropIndex("dbo.CourseObjectives", new[] { "Course_Id" });
            DropIndex("dbo.Comments", new[] { "Course_Id" });
            DropIndex("dbo.Questions", new[] { "Objective_Id" });
            DropIndex("dbo.LearningContents", new[] { "Question_Id" });
            DropIndex("dbo.Answers", new[] { "Question_Id" });
            DropTable("dbo.CourseObjectives");
            DropTable("dbo.ImageFiles");
            DropTable("dbo.MailNotifications");
            DropTable("dbo.UserSettings");
            DropTable("dbo.PasswordRecoveryTickets");
            DropTable("dbo.Users");
            DropTable("dbo.HelpHints");
            DropTable("dbo.CourseTemplateSettings");
            DropTable("dbo.Templates");
            DropTable("dbo.Comments");
            DropTable("dbo.Courses");
            DropTable("dbo.Objectives");
            DropTable("dbo.LearningContents");
            DropTable("dbo.Questions");
            DropTable("dbo.Answers");
        }
    }
}
