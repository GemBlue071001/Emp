using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;

namespace ManagerStaff.Services
{
    public interface IDepartmentService
    {
        Task<List<DepartmentResponse>> GetAllDepartmentsWithSubDepartmentsAsync();
        Task<DepartmentCreateResponse> CreateDepartment(DepartmentCreateRequest request);
        Task<DepartmentResponse> UpdateDepartment(DepartmentUpdateRequest request);
        Task<bool> DeleteDepartment(int id);
    }
}
