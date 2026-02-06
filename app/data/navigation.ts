export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "About Us",
    href: "/about-us",
    children: [
      { label: "Our Purpose & Values", href: "/about-us" },
      { label: "Our Business & Brands", href: "/about-us/our-business-brands" },
      { label: "Our Passion for Food", href: "/about-us/our-passion-for-food" },
      { label: "Our Leadership", href: "/about-us/our-leadership" },
      { label: "Our History", href: "/about-us/our-history" },
    ],
  },
  {
    label: "Sustainability",
    href: "/sustainability",
    children: [
      { label: "Sustainability at McCain", href: "/sustainability" },
      { label: "Smart & Sustainable Farming", href: "/sustainability/smart-sustainable-farming" },
      { label: "Resource-Efficient Operations", href: "/sustainability/resource-efficient-operations" },
      { label: "Good Food", href: "/sustainability/good-food" },
      { label: "Thriving Communities", href: "/sustainability/thriving-communities" },
      { label: "Reports & Downloads", href: "/sustainability/reports-downloads" },
    ],
  },
  {
    label: "Careers",
    href: "https://careers.mccain.com/",
  },
  {
    label: "Info Centre",
    href: "/information-centre/news",
    children: [
      { label: "Latest News", href: "/information-centre/news" },
      { label: "FAQs", href: "/information-centre/news" },
      { label: "McCain Foods Worldwide", href: "/information-centre/news" },
    ],
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

export interface RegionLink {
  name: string;
  url: string;
}

export interface RegionGroup {
  region: string;
  links: RegionLink[];
}

export const retailLinks: RegionGroup[] = [
  {
    region: "Americas",
    links: [
      { name: "Argentina", url: "http://www.mccain.com.ar" },
      { name: "Canada", url: "http://www.mccain.ca" },
      { name: "Colombia", url: "http://www.mccain.com.co" },
      { name: "Mexico", url: "http://www.mccain.com.mx" },
      { name: "USA", url: "http://www.mccainpotatoes.com" },
    ],
  },
  {
    region: "Asia Pacific",
    links: [
      { name: "Australia", url: "http://mccain.com.au/" },
      { name: "India", url: "http://www.mccainindia.com" },
      { name: "Japan", url: "http://www.mccain.co.jp" },
      { name: "New Zealand", url: "http://mccain.com.au/" },
      { name: "Taiwan", url: "http://www.mccain.tw" },
    ],
  },
  {
    region: "Africa",
    links: [{ name: "South Africa", url: "http://mccain.co.za" }],
  },
  {
    region: "Europe",
    links: [
      { name: "Austria", url: "http://www.mccain.at" },
      { name: "Belgium", url: "http://www.mccain.be" },
      { name: "Czech Republic", url: "http://www.mccain.cz" },
      { name: "France", url: "http://www.mccain.fr" },
      { name: "Germany", url: "http://www.mccain.de" },
      { name: "Greece", url: "http://www.mccain.gr" },
      { name: "Italy", url: "http://www.mccain.it" },
      { name: "Netherlands", url: "http://www.mccain.nl" },
      { name: "Poland", url: "http://www.mccain.pl" },
      { name: "Portugal", url: "http://www.mccain.pt" },
      { name: "Slovakia", url: "http://www.mccain.sk" },
      { name: "Spain", url: "http://www.mccain.es" },
      { name: "Switzerland", url: "http://www.mccain.ch" },
      { name: "UK", url: "http://www.mccain.co.uk/" },
    ],
  },
];

export const socialLinks = [
  { name: "LinkedIn", url: "https://www.linkedin.com/company/mccainfoods/", icon: "linkedin" },
  { name: "Instagram", url: "https://www.instagram.com/mccainglobal/", icon: "instagram" },
  { name: "Facebook", url: "https://www.facebook.com/mccainglobal", icon: "facebook" },
  { name: "Twitter", url: "https://twitter.com/mccainglobal", icon: "twitter" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCjkc9iJmwWNXZ3KN8vYoeVw", icon: "youtube" },
];
