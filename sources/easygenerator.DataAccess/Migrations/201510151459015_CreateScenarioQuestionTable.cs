namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateScenarioQuestionTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ScenarioQuestions",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        ProjectId = c.String(),
                        EmbedCode = c.String(),
                        EmbedUrl = c.String(),
                        ProjectArchiveUrl = c.String(),
                        MasteryScore = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Id)
                .Index(t => t.Id);
            
            AlterColumn("dbo.Questions", "Discriminator", c => c.String(maxLength: 128));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ScenarioQuestions", "Id", "dbo.Questions");
            DropIndex("dbo.ScenarioQuestions", new[] { "Id" });
            AlterColumn("dbo.Questions", "Discriminator", c => c.String(nullable: false, maxLength: 128));
            DropTable("dbo.ScenarioQuestions");
        }
    }
}
