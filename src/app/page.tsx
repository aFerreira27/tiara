import SignInButton from "../components/SignInButton";
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <Image 
          src="/tiaraLogo.svg" 
          alt="Tiara Logo" 
          width={400} // Increased size slightly
          height={400} // Increased size slightly
          className="mb-1" // Add margin bottom
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome to Tiara</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Please sign in to access your account.</p>
        <SignInButton />
      </div>
    </main>
  );
}