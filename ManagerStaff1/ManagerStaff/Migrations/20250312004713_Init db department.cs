using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ManagerStaff.Migrations
{
    /// <inheritdoc />
    public partial class Initdbdepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "Departments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_ParentId",
                table: "Departments",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Departments_ParentId",
                table: "Departments",
                column: "ParentId",
                principalTable: "Departments",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Departments_ParentId",
                table: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Departments_ParentId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "Departments");
        }
    }
}
