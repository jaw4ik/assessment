namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveHelpHintTableAndEntity : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.HelpHints");
        }
        
        public override void Down()
        {
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
            
        }
    }
}
