namespace easygenerator.StorageServer.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAudioTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Audios",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        VimeoId = c.String(nullable: false),
                        Title = c.String(nullable: false),
                        Duration = c.Double(nullable: false),
                        Size = c.Long(nullable: false),
                        UserId = c.Guid(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Audios");
        }
    }
}
