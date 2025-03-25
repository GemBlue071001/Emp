namespace ManagerStaff.Dto.Response
{
    public class SignInResponse //chứa thông tin người dùng khi đnhap thành công
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string Role { get; set; }

        public SignInResponse(string accessToken, string refreshToken, string role)
        {
            this.AccessToken = accessToken;
            this.RefreshToken = refreshToken;
            Role = role;
        }
    }
}
