namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImageFileTable : DbMigration
    {
        public override void Up()
        {
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
            DropTable("dbo.ImageFiles");
        }
    }
}
