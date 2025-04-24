using System;

namespace AcademyApi.Dtos
{
    public class WeekWorkDto
    {
        public int Id { get; set; }
        public DateTime WorkDate { get; set; }
        public string? Activity { get; set; }
    }
}
