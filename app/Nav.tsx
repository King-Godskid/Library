import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mb-6 flex gap-4 border-b pb-3">
      <Link href="/" className="font-medium underline">
        Books
      </Link>
      <Link href="/members" className="font-medium underline">
        Members
      </Link>
    </nav>
  );
}