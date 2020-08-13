export class UpdateProfileData {
  // "customerData":{
  //
  // }
  custId: number;
  fName: string;
  mName: string;
  lName: string;
  tel: string;
  cell: string;
  eMail: string;
  optIn: string;
  MobileOptIn: number;
}
export class UpdateUserProfileBody {
  tId: string;
  data: any;
}
