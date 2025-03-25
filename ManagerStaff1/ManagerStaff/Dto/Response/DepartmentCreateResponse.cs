namespace ManagerStaff.Dto.Response
{
    public class DepartmentCreateResponse
    {
        public string Name { get; set; }
        public int ParentId { get; set; }
        public DepartmentCreateResponse() { }
        public DepartmentCreateResponse(string name, int parentId)
        {
            this.Name = name;
            this.ParentId = parentId;
        }
    }
}
