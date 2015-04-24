namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateHttpRequestsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.HttpRequests",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Url = c.String(nullable: false, maxLength: 255),
                        Verb = c.String(nullable: false, maxLength: 15),
                        Content = c.String(),
                        ServiceName = c.String(nullable: false, maxLength: 127),
                        SendAttempts = c.Int(nullable: false),
                        ReportOnFailure = c.Boolean(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.HttpRequests");
        }
    }
}
