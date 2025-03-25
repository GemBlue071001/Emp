namespace ManagerStaff.Dto.Response
{
    public class UserResponse
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string UserType { get; set; }
        public string DepartmentName { get; set; }
        public string SubDepartment { get; set; }
        public int? RoleId { get; set; }
    }
}
