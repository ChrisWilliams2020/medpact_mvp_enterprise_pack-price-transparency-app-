using MedPact.Domain.Common;

namespace MedPact.Domain.Identity;

public class UserRole : TenantScopedEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
}
