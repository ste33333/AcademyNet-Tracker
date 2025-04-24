using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace AcademyApi.Dtos
{
    public class WorkerDto 
    {
        [Required]
        [StringLength(4)] 
        public string Enrollment { get; set; }

        [Required]
        [MaxLength(35)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(50)]
        public string Role { get; set; }

        [Required]
        [MaxLength(50)]
        public string Department { get; set; }
    }
}
