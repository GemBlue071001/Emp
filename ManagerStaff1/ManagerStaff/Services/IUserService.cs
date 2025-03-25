using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;

namespace ManagerStaff.Services
{
    public interface IUserService
    {
        Task<UserCreationResponse> CreateUser(UserCreationRequest request);
        Task<PageResponse<UserResponse>> FindAll(int page, int size, string? searchQuery = null);
        Task<List<Employee>> GetEmployeesBySameDepartment(int departmentId);
        Task<UserUpdateResponse> UpdateUser(UserUpdateRequest request);
        Task<bool> DeleteUserByEmailAsync(string email);

    }
}
