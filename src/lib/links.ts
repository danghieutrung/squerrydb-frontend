import { Github, Globe, Linkedin } from "lucide-react";

export const CONTACT_EMAIL = "contact.hieudang@gmail.com";

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/danghieutrung", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/trunghieudang",
    icon: Linkedin,
  },
  { label: "Website", href: "https://dangtrunghieu.vercel.app/", icon: Globe },
];

export const IMDB_DATASETS_URL =
  "https://developer.imdb.com/non-commercial-datasets/";

export function imdbTitleUrl(tconst: string) {
  return `https://www.imdb.com/title/${tconst}/`;
}
