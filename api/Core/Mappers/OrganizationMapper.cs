using AutoMapper;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class OrganizationMapper : Profile
    {
        public OrganizationMapper()
        {
            // LocationType mappings
            CreateMap<LocationType, LocationTypeDto>();
            CreateMap<CreateLocationTypeDto, LocationType>();
            CreateMap<UpdateLocationTypeDto, LocationType>();

            // Organization mappings
            CreateMap<Organization, OrganizationDto>();
            CreateMap<CreateOrganizationDto, Organization>();
            CreateMap<UpdateOrganizationDto, Organization>();

            // OrganizationAccount mappings
            CreateMap<OrganizationAccount, OrganizationAccountDto>();
            CreateMap<CreateOrganizationAccountDto, OrganizationAccount>();
            CreateMap<UpdateOrganizationAccountDto, OrganizationAccount>();
        }
    }
}
