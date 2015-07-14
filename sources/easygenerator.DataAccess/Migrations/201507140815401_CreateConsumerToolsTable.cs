namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class CreateConsumerToolsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ConsumerTools",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Title = c.String(maxLength: 255),
                    Domain = c.String(maxLength: 255),
                    Key = c.String(nullable: false),
                    Secret = c.String(nullable: false),
                })
                .PrimaryKey(t => t.Id);
        }

        public override void Down()
        {
            DropTable("dbo.ConsumerTools");
        }
    }
}
