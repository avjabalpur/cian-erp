using AutoMapper;
using Xcianify.Core.DTOs.Customer;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class CustomerMapper : Profile
    {
        public CustomerMapper()
        {
            CreateMap<Customer, CustomerDto>();
            CreateMap<CreateCustomerDto, Customer>();
            CreateMap<UpdateCustomerDto, Customer>();
        }
    }
} 