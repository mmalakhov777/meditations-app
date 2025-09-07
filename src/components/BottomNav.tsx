"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";

const items = [
  { href: "/", labelKey: "nav.today" },
  { href: "/calendar", labelKey: "nav.calendar" },
  { href: "/favorites", labelKey: "nav.favorites" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container">
        <div className="bottom-nav__wrap">
          <div className="bottom-nav__grid">
            {items.map(it => {
              const active = pathname === it.href;
              return (
                <Link key={it.href} href={it.href} className={`bottom-nav__item ${active ? "is-active" : ""}`}>
                  {t(it.labelKey)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}


