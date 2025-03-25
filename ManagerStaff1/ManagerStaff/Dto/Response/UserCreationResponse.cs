namespace ManagerStaff.Dto.Response
{
    public class UserCreationResponse   //Chứa thông tin người dùng mới
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string userType { get; set; }
        public string UserName { get; set; }


        public UserCreationResponse() { }

        public UserCreationResponse(string FirstName, string LastName, string Email, string Phone, string userType, string UserName)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Email = Email;
            this.Phone = Phone;
            this.userType = userType;
            this.UserName = UserName;
        }
    }
}
