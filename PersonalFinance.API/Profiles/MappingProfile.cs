using AutoMapper;
using PersonalFinance.API.DTOs.Account;
using PersonalFinance.API.DTOs.Budget;
using PersonalFinance.API.DTOs.Category;
using PersonalFinance.API.DTOs.Transaction; 
using PersonalFinance.API.Models;

namespace PersonalFinance.API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //  mappings (source -> destination)
            CreateMap<Category, CategoryDto>();
            CreateMap<Account, AccountDto>();

            
            //  to get CategoryName and AccountName
            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.Name))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account!.Name))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.AccountId, opt => opt.MapFrom(src => src.AccountId));

            CreateMap<Budget, BudgetDto>()
    .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.Name));

            CreateMap<Transaction, TransactionCsvDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category!.Name))
                .ForMember(dest => dest.Account, opt => opt.MapFrom(src => src.Account!.Name))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        }
    }
}