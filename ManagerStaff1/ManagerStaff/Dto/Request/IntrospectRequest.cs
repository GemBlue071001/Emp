namespace ManagerStaff.Dto.Request
{
    public class IntrospectRequest  //Kiểm tra JWT token có hợp lệ hay không
    {
        public string Token { get; set; }
    }
}
