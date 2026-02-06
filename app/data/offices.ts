export interface Office {
  region: string;
  company: string;
  address: string[];
  tel?: string;
  website?: string;
}

export const corporateHQ: Office = {
  region: "Corporate HQ",
  company: "McCain Foods Limited",
  address: ["439 King Street West, 5th Floor", "Toronto, ON, Canada M5V 1K4"],
  tel: "(416) 955-1700",
  website: "http://www.mccain.com",
};

export const regionalOffices: Office[] = [
  {
    region: "Canada",
    company: "McCain Foods (Canada), a Division of McCain Foods Limited",
    address: ["8800 Main Street", "Florenceville-Bristol, New Brunswick, Canada E7L 1B2"],
    tel: "(506) 392-5541",
  },
  {
    region: "USA",
    company: "McCain Foods USA Inc.",
    address: ["One Tower Lane, 11th Floor", "Oakbrook Terrace, IL USA 60181"],
    tel: "+1 (800) 938-7799",
  },
  {
    region: "United Kingdom",
    company: "McCain Foods (GB) Limited",
    address: ["Havers Hill, Scarborough", "North Yorkshire, England, Y011 3BS"],
    tel: "+44 (0) 1723 584141",
  },
  {
    region: "Australia & New Zealand",
    company: "McCain Foods (Aust) Pty. Ltd.",
    address: ["Ring Road, Wendouree", "Victoria, Australia, 3355"],
    tel: "+61 3 5338 0200",
  },
  {
    region: "South Africa",
    company: "McCain Foods (South Africa) (Pty) Ltd.",
    address: ["Oxford & Glenhove Building, Block 1, 2nd Floor", "Suite 10, 116 Oxford Road, Rosebank, 2196"],
    tel: "+27 11 856 6000",
  },
  {
    region: "South America",
    company: "McCain Do Brasil Alimentos Ltd.",
    address: ["Av. Brigadeiro Faria Lima 4300, 12° Andar", "Itaim Bibi, São Paulo SP 04538-132, Brasil"],
    tel: "+55 11 3848 3633",
  },
  {
    region: "Continental Europe & MENA",
    company: "McCain Continental Europe",
    address: ["41, Rue Heracles", "59650 Villeneuve d'Ascq, France"],
    tel: "+33 359 36 05 00",
  },
  {
    region: "India",
    company: "McCain Foods (India) Private Limited",
    address: ["Ground Floor, The Crescent Plot no 1 to 7", "Lado Sarai, New Delhi - 110030"],
  },
  {
    region: "China",
    company: "McCain Foods (Harbin) Co. Ltd.",
    address: ["2F, Building 11, No.207, Meng Zi Rd.", "Shanghai 200023 China"],
  },
];
