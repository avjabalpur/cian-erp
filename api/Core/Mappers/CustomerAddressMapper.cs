using AutoMapper;
using Xcianify.Core.DTOs.CustomerAddress;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class CustomerAddressMapper : Profile
    {
        public CustomerAddressMapper()
        {
            CreateMap<CustomerAddress, CustomerAddressDto>();
            CreateMap<CreateCustomerAddressDto, CustomerAddress>();
            CreateMap<UpdateCustomerAddressDto, CustomerAddress>();
        }
    }
}
