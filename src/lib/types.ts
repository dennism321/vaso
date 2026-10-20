export type ActionResult<T = undefined> = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  data?: T;
};

export type BookingConfirmation = {
  reference: string;
  date: string;
  time: string;
  type: string;
  name: string;
};

export type SlotAvailability = { time: string; available: boolean };
