export class AddressDetail {
  custAddrId: number;
  custId: number;
  fName: string;
  mName: string;
  lName: string;
  addrName: string="Home";
  Addr1: string;
  Addr2: string;
  City: string;
  State: string;
  zip: string;
  ZIP:string;
  instr: string;
  isPrimary: number;
  tel: string;
  lat: number;
  lon: number;
  Latitude:number;
  Longitude:number;
  CustAddressBookId:number;
  selectedIndex:number;
}
export class AddAddressBody {
  tId: string;
  data: any;
}
