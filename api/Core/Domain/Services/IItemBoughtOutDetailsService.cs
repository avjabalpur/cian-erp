using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemBoughtOut;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemBoughtOutDetailsService
    {
        Task<ItemBoughtOutDetailsDto> GetByItemIdAsync(int itemId);
        Task<ItemBoughtOutDetailsDto> GetByIdAsync(int id);
        Task<ItemBoughtOutDetailsDto> CreateAsync(CreateItemBoughtOutDetailsDto createDto, int userId);
        Task<ItemBoughtOutDetailsDto> UpdateAsync(int id, UpdateItemBoughtOutDetailsDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
} 