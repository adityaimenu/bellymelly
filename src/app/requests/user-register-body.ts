class CustomerData {
  fName: string;
  lName: string;
  otp: string;
  mName: string;
  tel: string;
  cell: string;
  eMail: string;
  mobileOptIn: number;
  
}
class RegisterData {
  customerData: CustomerData;
  password: string;
  checkOTP:number=1;
  locname:string;
}
export class RegisterBody {
  tid: string;
  tId: string;
  data: RegisterData;
}
export class UserRegisterBody {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  otpId: string;
  otp: string;
}
