import React from "react";
import DashboardGreeting from "../DashboardGreeting";
import { auth } from "@/auth";
import Link from "next/link";
import { CalendarDays, BookOpenText, Notebook, Slash } from "lucide-react";

const SECONDARY_HEADER_ITEMS: SecondaryHeaderItemProps[] = [
  {
    label: "Dashboard",
    ariaLabel: "Go to your Dashboard",
    href: "/dashboard",
    icon: Notebook,
  },
  {
    label: "Planner",
    ariaLabel: "Go to your weekly planner",
    href: "/plan/week",
    icon: CalendarDays,
  },
  {
    label: "Review",
    ariaLabel: "See your tasks in review",
    href: "/review",
    icon: BookOpenText,
  },
];

type SecondaryHeaderItemProps = {
  label: string;
  href: string;
  ariaLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};
export async function SecondaryHeader() {
  const session = await auth();
  const username = session?.user?.name || session?.user?.email || "User";

  return (
    <section>
      <div className="flex justify-between px-6 py-4 text-text">
        <DashboardGreeting username={username} />
        <div className="flex gap-2">
          {SECONDARY_HEADER_ITEMS.map((item, index) => (
            <React.Fragment key={item.href}>
              <SecondaryHeaderItem key={item.label} {...item} />
              {index < SECONDARY_HEADER_ITEMS.length - 1 && (
                <div className="flex items-center px-1 text-secondary">
                  <Slash size={18} className="inline-block" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

const SecondaryHeaderItem: React.FC<SecondaryHeaderItemProps> = ({
  label,
  href,
  icon: Icon,
  ariaLabel,
}) => {
  return (
    <Link
      className="text-text hover:text-secondary text-lg font-semibold flex items-center"
      href={href}
      role="button"
      aria-label={ariaLabel}
    >
      <Icon size={20} className="inline-block mr-2" />
      {label}
    </Link>
  );
};
