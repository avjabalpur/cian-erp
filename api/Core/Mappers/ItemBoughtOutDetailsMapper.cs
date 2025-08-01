using AutoMapper;
using Xcianify.Core.DTOs.ItemBoughtOut;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemBoughtOutDetailsMapper
    {
        private readonly IMapper _mapper;

        public ItemBoughtOutDetailsMapper()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<ItemBoughtOutDetails, ItemBoughtOutDetailsDto>();
                cfg.CreateMap<ItemBoughtOutDetailsDto, ItemBoughtOutDetails>();
                cfg.CreateMap<CreateItemBoughtOutDetailsDto, ItemBoughtOutDetails>();
                cfg.CreateMap<UpdateItemBoughtOutDetailsDto, ItemBoughtOutDetails>();
            });

            _mapper = config.CreateMapper();
        }

        public ItemBoughtOutDetailsDto MapToDto(ItemBoughtOutDetails entity)
        {
            return entity != null ? _mapper.Map<ItemBoughtOutDetailsDto>(entity) : null;
        }

        public ItemBoughtOutDetails MapToEntity(ItemBoughtOutDetailsDto dto)
        {
            return dto != null ? _mapper.Map<ItemBoughtOutDetails>(dto) : null;
        }

        public ItemBoughtOutDetails MapToEntity(CreateItemBoughtOutDetailsDto dto)
        {
            return dto != null ? _mapper.Map<ItemBoughtOutDetails>(dto) : null;
        }

        public ItemBoughtOutDetails MapToEntity(UpdateItemBoughtOutDetailsDto dto)
        {
            return dto != null ? _mapper.Map<ItemBoughtOutDetails>(dto) : null;
        }
    }
} 