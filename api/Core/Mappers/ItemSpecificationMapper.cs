using AutoMapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemSpecificationMapper : Profile
    {

       
            private readonly IMapper _mapper;

            public ItemSpecificationMapper()
            {
                var config = new MapperConfiguration(cfg =>
                {
                    cfg.CreateMap<ItemSpecification, ItemSpecificationDto>();
                    cfg.CreateMap<ItemSpecificationDto, ItemSpecification>();
                    cfg.CreateMap<CreateItemSpecificationDto, ItemSpecification>();
                    cfg.CreateMap<UpdateItemSpecificationDto, ItemSpecification>();
                });

                _mapper = config.CreateMapper();
            }

            public ItemSpecificationDto MapToDto(ItemSpecification entity)
            {
                return entity != null ? _mapper.Map<ItemSpecificationDto>(entity) : null;
            }

            public ItemSpecification MapToEntity(ItemSpecificationDto dto)
            {
                return dto != null ? _mapper.Map<ItemSpecification>(dto) : null;
            }

            public ItemSpecification MapToEntity(CreateItemSpecificationDto dto)
            {
                return dto != null ? _mapper.Map<ItemSpecification>(dto) : null;
            }

            public ItemSpecification MapToEntity(UpdateItemSpecificationDto dto)
            {
                return dto != null ? _mapper.Map<ItemSpecification>(dto) : null;
            }
        
        }
} 