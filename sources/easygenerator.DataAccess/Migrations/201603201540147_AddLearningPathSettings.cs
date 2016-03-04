namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLearningPathSettings : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LearningPathSettings",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Data = c.String(),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.LearningPaths", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LearningPathSettings", "Id", "dbo.LearningPaths");
            DropIndex("dbo.LearningPathSettings", new[] { "Id" });
            DropTable("dbo.LearningPathSettings");
        }
    }
}
