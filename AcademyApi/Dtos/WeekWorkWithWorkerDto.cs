namespace AcademyApi.Dtos
{
    public class WeekWorkWithWorkerDto
    {
        public int Id { get; set; }
        public DateTime WorkDate { get; set; }
        public string? Activity { get; set; }
        public string WorkerEnrollement { get; set; } = null!; // FK
        public string WorkerFullName { get; set; } = null!;
    }
}
