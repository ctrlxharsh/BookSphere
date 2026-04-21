import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 w-full mt-auto rounded-t-xl px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_-4px_20px_0_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <Link to="/" className="font-headline text-xl text-amber-500 font-bold">
          Maulana Azad Library
        </Link>
        <p className="font-body text-sm text-stone-300">
          © 2026 Maulana Azad Library, Aligarh Muslim University. All Rights Reserved.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 font-body text-sm">
        <Link to="/about" className="text-stone-400 hover:text-white transition-colors duration-300">About</Link>
        <Link to="/research" className="text-stone-400 hover:text-white transition-colors duration-300">Research</Link>
        <Link to="/catalog" className="text-stone-400 hover:text-white transition-colors duration-300">Collections</Link>
        <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
        <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">Contact Us</a>
      </div>
    </footer>
  );
}
