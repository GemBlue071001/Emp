using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ManagerStaff.Model
{
    public class Department
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ParentId { get; set; }
        public Department ?Parent { get; set; }
        public ICollection<Department>? SubDepartments { get; set; }
        public ICollection<Employee>? Users { get; set; }
    }
}
