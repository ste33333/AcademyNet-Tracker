using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace AcademyApi.Dtos
{
    public class WorkerDetailDto : WorkerBaseDto 
    {
        [Required]
        [StringLength(4)]
        public string Enrollment { get; set; }

        public List<WeekWorkDto>? WeekWorks { get; set; } = new List<WeekWorkDto>();
    }
}
