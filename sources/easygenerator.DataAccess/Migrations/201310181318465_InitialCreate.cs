namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Objectives",
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
            
            CreateTable(
                "dbo.Experiences",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(nullable: false, maxLength: 255),
                        BuildOn = c.DateTime(),
                        PackageUrl = c.String(),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        Template_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .Index(t => t.Template_Id);
            
            CreateTable(
                "dbo.Templates",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(nullable: false),
                        Image = c.String(nullable: false),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Questions",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(nullable: false, maxLength: 255),
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
                "dbo.LearningObjects",
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
                        FullName = c.String(),
                        Phone = c.String(),
                        Organization = c.String(),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
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
                "dbo.ExperienceObjectives",
                c => new
                    {
                        Objective_Id = c.Guid(nullable: false),
                        Experience_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Objective_Id, t.Experience_Id })
                .ForeignKey("dbo.Objectives", t => t.Objective_Id, cascadeDelete: true)
                .ForeignKey("dbo.Experiences", t => t.Experience_Id, cascadeDelete: true)
                .Index(t => t.Objective_Id)
                .Index(t => t.Experience_Id);

            Sql("ALTER TABLE Users ADD CONSTRAINT UQ_Email UNIQUE (Email)");
            
            Sql("INSERT INTO dbo.Templates VALUES(NEWID(), 'Freestyle learning', '/Content/images/freestyleLearningTemplate.png', 'Some user', GETDATE(), 'Some user', GETDATE())");
            Sql("INSERT INTO dbo.Templates VALUES(NEWID(), 'Quiz', '/Content/images/quizTemplate.png', 'Some user', GETDATE(), 'Some user', GETDATE())");
        }
        
        public override void Down()
        {
            DropIndex("dbo.ExperienceObjectives", new[] { "Experience_Id" });
            DropIndex("dbo.ExperienceObjectives", new[] { "Objective_Id" });
            DropIndex("dbo.PasswordRecoveryTickets", new[] { "User_Id" });
            DropIndex("dbo.LearningObjects", new[] { "Question_Id" });
            DropIndex("dbo.Answers", new[] { "Question_Id" });
            DropIndex("dbo.Questions", new[] { "Objective_Id" });
            DropIndex("dbo.Experiences", new[] { "Template_Id" });
            DropForeignKey("dbo.ExperienceObjectives", "Experience_Id", "dbo.Experiences");
            DropForeignKey("dbo.ExperienceObjectives", "Objective_Id", "dbo.Objectives");
            DropForeignKey("dbo.PasswordRecoveryTickets", "User_Id", "dbo.Users");
            DropForeignKey("dbo.LearningObjects", "Question_Id", "dbo.Questions");
            DropForeignKey("dbo.Answers", "Question_Id", "dbo.Questions");
            DropForeignKey("dbo.Questions", "Objective_Id", "dbo.Objectives");
            DropForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates");
            DropTable("dbo.ExperienceObjectives");
            DropTable("dbo.MailNotifications");
            DropTable("dbo.HelpHints");
            DropTable("dbo.PasswordRecoveryTickets");
            DropTable("dbo.Users");
            DropTable("dbo.LearningObjects");
            DropTable("dbo.Answers");
            DropTable("dbo.Questions");
            DropTable("dbo.Templates");
            DropTable("dbo.Experiences");
            DropTable("dbo.Objectives");
        }
    }
}
