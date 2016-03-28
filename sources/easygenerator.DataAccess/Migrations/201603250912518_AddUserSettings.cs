namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserSettings : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserSettings",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        LastReadReleaseNote = c.String(maxLength: 25),
                        NewEditor = c.Boolean(),
                        IsCreatedThroughLti = c.Boolean(nullable: false),
                        IsNewEditorByDefault = c.Boolean(nullable: false, defaultValue: false),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id);

            Sql("INSERT INTO dbo.UserSettings (Id, LastReadReleaseNote, NewEditor, IsCreatedThroughLti, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn) SELECT Id, LastReadReleaseNote, NewEditor, IsCreatedThroughLti, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn from dbo.Users");

            DropColumn("dbo.Users", "LastReadReleaseNote");
            DropColumn("dbo.Users", "NewEditor");
            DropColumn("dbo.Users", "IsCreatedThroughLti");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "IsCreatedThroughLti", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "NewEditor", c => c.Boolean());
            AddColumn("dbo.Users", "LastReadReleaseNote", c => c.String(maxLength: 25));
            DropForeignKey("dbo.UserSettings", "Id", "dbo.Users");
            DropIndex("dbo.UserSettings", new[] { "Id" });
            DropTable("dbo.UserSettings");
        }
    }
}
