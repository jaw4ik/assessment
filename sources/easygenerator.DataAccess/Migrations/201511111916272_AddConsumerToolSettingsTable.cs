namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddConsumerToolSettingsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ConsumerToolSettings",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        AccessType = c.Int(),
                        ExpirationPeriod = c.Int(),
                        Company_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Companies", t => t.Company_Id)
                .ForeignKey("dbo.ConsumerTools", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id)
                .Index(t => t.Company_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ConsumerToolSettings", "Id", "dbo.ConsumerTools");
            DropForeignKey("dbo.ConsumerToolSettings", "Company_Id", "dbo.Companies");
            DropIndex("dbo.ConsumerToolSettings", new[] { "Company_Id" });
            DropIndex("dbo.ConsumerToolSettings", new[] { "Id" });
            DropTable("dbo.ConsumerToolSettings");
        }
    }
}
