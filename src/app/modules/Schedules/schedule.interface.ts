export type TSchedule = {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
};

export type TFilterRequest = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};
