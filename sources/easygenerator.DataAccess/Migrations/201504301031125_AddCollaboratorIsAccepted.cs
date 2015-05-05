namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddCollaboratorIsAccepted : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CourseCollaborators", "IsAccepted", c => c.Boolean(nullable: false));
            Sql("UPDATE dbo.CourseCollaborators SET IsAccepted = 1");
        }

        public override void Down()
        {
            DropColumn("dbo.CourseCollaborators", "IsAccepted");
        }
    }
}
