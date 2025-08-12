using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemCodeSequenceService
    {
        Task<ItemCodeSequence> CreateAsync(CreateItemCodeSequenceDto dto);
    }
}
