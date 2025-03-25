using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ManagerStaff.Model
{
    [Table("employee")]
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Required, EmailAddress]
        [Column("email")]
        public string Email { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string? Phone { get; set; }

        [Column("password")]
        [JsonIgnore]
        public string? Password { get; set; }

        [Required]
        [Column("name")]
        public string UserName { get; set; }

        public int? RoleId { get; set; }
        public Role? Role { get; set; }

        public int? DepartmentId { get; set; }
        [JsonIgnore]
        public Department? Department { get; set; }
    }
}
