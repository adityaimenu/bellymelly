export class RestSignUpBody {
  tId: string;
  data: {
    customerData: SignUpCustomerData;
    password: string;
  };
}
export class SignUpCustomerData {
  fName: string;
  OTP: string;
  mName: string;
  tel: string;
  cell: string;
  eMail: string;
  isCheckOTP: string;
  mobileOptIn: number;
}
