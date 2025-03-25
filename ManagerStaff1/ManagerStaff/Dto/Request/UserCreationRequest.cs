namespace ManagerStaff.Dto.Request
{
    public class UserCreationRequest    //Chứa thông tin tạo người dùng mới
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int DepartmentId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public UserCreationRequest() { }

        public UserCreationRequest(string FirstName, string LastName, string Email, string Phone, int DepartmentId, string UserName, string Password)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Email = Email;
            this.Phone = Phone;
            this.DepartmentId = DepartmentId;
            this.UserName = UserName;
            this.Password = Password;
        }
    }
}
