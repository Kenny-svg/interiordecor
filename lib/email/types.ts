export type StudioEmail = {
  to: string;
  subject: string;
  text: string;
};

export type EmailProvider = {
  name: string;
  send(message: StudioEmail): Promise<void>;
};
