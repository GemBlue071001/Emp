namespace ManagerStaff.Dto.Response
{
    public class UserUpdateResponse //Chứa thông tin người dùng sau khi update
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        public UserUpdateResponse() { }
        public UserUpdateResponse(string FirstName, string LastName, string Email, string Phone, string UserName, string Password)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Email = Email;
            this.Phone = Phone;
            this.UserName = UserName;
            this.Password = Password;
        }
    }
}
