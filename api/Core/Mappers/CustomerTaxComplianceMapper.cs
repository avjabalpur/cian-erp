using AutoMapper;
using Xcianify.Core.DTOs.CustomerTaxCompliance;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class CustomerTaxComplianceMapper : Profile
    {
        public CustomerTaxComplianceMapper()
        {
            CreateMap<CustomerTaxCompliance, CustomerTaxComplianceDto>();
            CreateMap<CreateCustomerTaxComplianceDto, CustomerTaxCompliance>();
            CreateMap<UpdateCustomerTaxComplianceDto, CustomerTaxCompliance>();
        }
    }
}
