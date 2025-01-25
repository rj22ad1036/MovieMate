import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="container mx-auto px-4 py-6">
        <Link href="/" className="text-red-600 text-3xl font-bold">
          MovieMate
        </Link>
      </nav>
    </header>
  );
}
