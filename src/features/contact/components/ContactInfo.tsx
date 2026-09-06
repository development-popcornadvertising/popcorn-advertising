import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/lib/siteConfig";

interface ContactRow {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Absent for the address, which is not something to click. */
  href?: string;
}

const rows: readonly ContactRow[] = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phoneHref}`,
  },
  { icon: MapPin, label: "Studio", value: siteConfig.contact.location },
];

/**
 * The left column: who you are writing to, and how else to reach them.
 *
 * The email and phone stay `mailto:` and `tel:`. Every *call to action* on
 * the site now points at this page, but these are the contact details
 * themselves, and turning them into links back to the page they are on
 * would be a loop.
 *
 * A <dl>, because each row is a term and its value. That also keeps the
 * labels available to a screen reader while the lucide mark beside them
 * stays decorative, which is the right split: the icon repeats the label,
 * so announcing both would say everything twice.
 */
export function ContactInfo() {
  return (
    <div>
      <Eyebrow className="rise rise-delay-0">Get in touch</Eyebrow>

      <h1
        id="contact-heading"
        className="mt-6 rise text-5xl font-extrabold tracking-[-0.035em] text-ink rise-delay-1"
      >
        Got a brand that needs to <span className="text-pop italic">pop?</span>
      </h1>

      <p className="mt-5 max-w-[34rem] rise text-base leading-snug text-ink-soft rise-delay-2">
        Tell us what you&apos;re building, whether that is a launch film, an influencer push or a
        full campaign, and we&apos;ll get back to you within a day.
      </p>

      <dl className="mt-12 flex rise flex-col gap-5 rise-delay-3">
        {rows.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-grape/12 text-grape">
              <Icon className="size-5" aria-hidden="true" />
            </span>

            <dt className="sr-only">{label}</dt>
            <dd className="font-medium text-ink">
              {href ? (
                <a href={href} className="transition-colors duration-200 hover:text-pop">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-10 flex rise gap-3 rise-delay-4">
        {siteConfig.social.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={item.label}
              className="grid size-11 place-items-center rounded-2xl border border-grape-tint text-grape transition-colors duration-200 hover:border-grape hover:bg-grape hover:text-white"
            >
              <SocialIcon network={item.icon} className="size-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
