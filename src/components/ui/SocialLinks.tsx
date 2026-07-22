import { FaTelegramPlane, FaInstagram } from "react-icons/fa";

type SocialLinksTone = "home" | "about" | "works";

type SocialLinksProps = {
  size?: number;
  gap?: number;
  tone?: SocialLinksTone;
};

const TONE_CLASS: Record<SocialLinksTone, string> = {
  home: "text-white/80",
  about: "text-white/70",
  works: "text-white/50",
};

const SOCIAL_LINKS = [
  { icon: FaTelegramPlane, label: "Telegram", href: "https://t.me/melrozay" },
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/dima.melroz/" },
];

export function SocialLinks({ size = 22, gap = 20, tone = "home" }: SocialLinksProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
      }}
    >
      {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`${TONE_CLASS[tone]} flex items-center transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70`}
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}
