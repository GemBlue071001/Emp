namespace ManagerStaff.Dto.Response
{
    public class PageResponse<T>    //hỗ trợ phân trang dữ liệu API
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public long TotalElemets { get; set; }
        public List<T>? Data { get; set; }
    }
}
