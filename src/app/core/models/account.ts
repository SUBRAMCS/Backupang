export class Account {
    accountProfileId: Number;
    registrationId: Number;
    individualId: Number;
    personalDetail: PersonalDetail;
    addressDetail: AddressDetail;
    contactDetail: ContactDetail;
}

export class PersonalDetail {
    individualId: Number;
    title: String;
    firstName: String;
    middleName: String;
    lastName: String;
    gender: String;
    dateOfBirth: String;
}

export class AddressDetail {
    addressId: Number;
    individualId: Number;
    addressLine1: String;
    addressLine2: String;
    addressLine3: String;
    addressLine4: String;
    countryState: String;
    country: String;
    postCode: String;
    recordUpdatedDate: String;
}

export class ContactDetail {
    primaryEmailId: Number;
    primaryEmailAddress: String;
    secondaryEmailId: Number;
    secondaryEmailAddress: String;
    primaryPhoneId: Number;
    primaryCountryCode: String;
    primaryPhoneNumber: String;
    secondaryPhoneId: Number;
    secondaryCountryCode: String;
    secondaryPhoneNumber: String;
}

export class DocumentDetail{
    documentId:Number;
    documentType:string;
    countryOfIssue:string;
    documentNumber:string;
    issueingAuthority:string;
    issueDate:string;
    expiaryDate:string;
    additionalInformation:string;
}

export class BankAccountDetails{
    
      bankName: string;
      selectCountry: string;
      address: string;
      emailAddressOne: string;
      emailAddressTwo: string;
      prmCountryCode: string;
      scndCountryCode: string;
      phoneNumPrim: string;
      phoneNumSec: string;
      postCode: string;
      websiteUrl: string;
      addInfoBank: string;
      selectedAddressId: string;
      selectPostCodeAddressId: string;
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      addressLine4: string;
      countryState: string;
      country: string;
}

export class PersonalDetailAccnt {
    individualId: Number;
    valAccntId: Number;
    vaAccntExtsnId: Number;
    title: String;
    firstName: String;
    middleName: String;
    lastName: String;
    gender: String;
    dateOfBirth: String;
    emailId: String;
    phoneId: String;
    additianalInfo: String;
}

export class AccountDetailAccnt {
    vaAccntExtsnAccntId: Number;
    valAccntId: Number;
    accountNo: String;
    shortCode: String;
    accounType: String;
    accountOpenDate: String;
    accountHolderNo: String;
    jointAccount: boolean;
    jntAccntHldrName1: String;
    jntAccntHldrName2: String;
    jntAccntHldrName3: String;
    jntAccntHldrName4: String;
    jntAccntHldrName5: String;
    additionalAccountInfo: String;
}


