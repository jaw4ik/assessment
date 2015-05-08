namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class SplitQuestionTypes : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Dropspots",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Text = c.String(nullable: false),
                        X = c.Int(nullable: false),
                        Y = c.Int(nullable: false),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                        Question_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Questions", t => t.Question_Id, cascadeDelete: true)
                .Index(t => t.Question_Id);

            AddColumn("dbo.Questions", "Background", c => c.String());
            AddColumn("dbo.Questions", "Discriminator", c => c.String(nullable: false, maxLength: 128));
            Sql("UPDATE dbo.Questions SET [Discriminator] = 'Multipleselect' WHERE Type = 0");
            Sql("UPDATE dbo.Questions SET [Discriminator] = 'FillInTheBlanks' WHERE Type = 1");
            Sql("UPDATE dbo.Questions SET [Discriminator] = 'DragAndDropText' WHERE Type = 2");
            Sql("UPDATE dbo.Questions SET [Discriminator] = 'Multiplechoice' WHERE Type = 3");
            DropColumn("dbo.Questions", "Type");
        }

        public override void Down()
        {
            AddColumn("dbo.Questions", "Type", c => c.Int(nullable: false));
            DropForeignKey("dbo.Dropspots", "Question_Id", "dbo.Questions");
            DropIndex("dbo.Dropspots", new[] { "Question_Id" });
            DropColumn("dbo.Questions", "Discriminator");
            DropColumn("dbo.Questions", "Background");
            DropTable("dbo.Dropspots");
        }
    }
}
