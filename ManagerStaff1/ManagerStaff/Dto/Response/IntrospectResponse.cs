namespace ManagerStaff.Dto.Response
{
    public class IntrospectResponse //Phản hồi trạng thái của token hợp lệ hoặc hết hạn
    {
        public bool Valid { get; set; }
        public string Scope { get; set; }
    }
}
