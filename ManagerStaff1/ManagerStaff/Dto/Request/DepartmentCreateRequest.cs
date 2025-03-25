namespace ManagerStaff.Dto.Request
{
    public class DepartmentCreateRequest
    {
        public string Name { get; set; }
        public int ParentId { get; set; }
        public DepartmentCreateRequest() { }
        public DepartmentCreateRequest(string name, int ParentId)
        {
            this.Name = name;
            this.ParentId = ParentId;
        }
    }
}