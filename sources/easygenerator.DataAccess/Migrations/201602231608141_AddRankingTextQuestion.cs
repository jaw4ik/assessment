namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRankingTextQuestion : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RankingTextAnswers",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Text = c.String(nullable: false),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                        Question_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);
            
            AddColumn("dbo.Questions", "AnswersOrder", c => c.String());
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.RankingTextAnswers", "Question_Id", "dbo.Questions");
            DropIndex("dbo.RankingTextAnswers", new[] { "Question_Id" });
            DropColumn("dbo.Questions", "AnswersOrder");
            DropTable("dbo.RankingTextAnswers");
        }
    }
}
