using System.ComponentModel.DataAnnotations;

namespace AcademyApi.Dtos
{
    public class CreateWeekWorkDto
    {
        [Required]
        public DateTime WorkDate { get; set; }

        [MaxLength(50)]
        public string? Activity { get; set; }
    }
}
