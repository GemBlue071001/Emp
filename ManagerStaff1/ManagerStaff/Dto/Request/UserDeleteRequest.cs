namespace ManagerStaff.Dto.Request
{
    public class UserDeleteRequest  //Chứa thông tin yêu cầu xóa người dùng
    {
        public string Email { get; set; }
        public UserDeleteRequest() { }
        public UserDeleteRequest(string Email)
        {
            this.Email = Email;
        }
    }
}
