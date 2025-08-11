using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemCodeSequenceService
    {
        Task<int> CreateAsync(CreateItemCodeSequenceDto dto);
    }
}
