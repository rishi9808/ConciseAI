"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`text-gray-600 text-sm hover:text-rose-500 transition-colors duration-200 ${className} ${
        isActive ? "text-rose-500" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
