import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 text-black">
      <h1 className="text-2xl">
        Welcome! Please
        <Link href="/login" className="text-blue-500 px-2">
          login
        </Link>
        to continue.
      </h1>
    </div>
  );
}
