export interface LoginFormViewProps
  extends React.ComponentPropsWithoutRef<"form"> {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  error?: string;
}