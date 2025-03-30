namespace ManagerStaff.Dto.Request
{
    public class DepartmentUpdateRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ParentId { get; set; }
    }
} 