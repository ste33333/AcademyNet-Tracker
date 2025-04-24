export interface CreateWeekWorkDto {
    workDate: string; // Formato YYYY-MM-DD richiesto da <input type="date">
    activity: string | null;
  }
  
  export interface UpdateWeekWorkDto {
    workDate: string;
    activity: string | null;
  }