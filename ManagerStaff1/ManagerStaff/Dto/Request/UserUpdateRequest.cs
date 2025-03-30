namespace ManagerStaff.Dto.Request
{
    public class UserUpdateRequest  //Chứa thông tin yêu cầu update người dùng
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int? DepartmentId { get; set; }

        public UserUpdateRequest() { }
        public UserUpdateRequest(string FirstName, string LastName, string Email, string Phone, string UserName, string Password, int? departmentId)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Email = Email;
            this.Phone = Phone;
            this.UserName = UserName;
            this.Password = Password;
            DepartmentId = departmentId;

        }
    }
}
