import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex gap-4">
        <Link href="/dashboard">
          <a className="text-white">Dashboard</a>
        </Link>
        <Link href="/travel">
          <a className="text-white">Viagens</a>
        </Link>
      </div>
    </nav>
  );
}
