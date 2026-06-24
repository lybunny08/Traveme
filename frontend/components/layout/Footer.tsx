import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Colonne de gauche */}
        <div className="space-y-20">
          <p className="text-4xl font-medium leading-tight">
            © Copyright 2025
          </p>
          
          <div className="relative w-[300px] h-48 rounded-2xl overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400" 
              alt="Footer visual" 
              fill 
              className="object-cover"
            />
          </div>

          <div>
            <h4 className="font-medium mb-4">Social Media</h4>
            <div className="flex gap-4">
              <Facebook size={20} />
              <Twitter size={20} />
              <Instagram size={20} />
              <Linkedin size={20} />
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-20">
          <p className="text-2xl font-light text-neutral-400 max-w-md">
            At TraveMe Pharetra Leo Nullam Quis Nibh Pellentesque Vestibulum. In Massa, Eu Sed Nunc Massa
          </p>

          <div className="text-neutral-400 space-y-1 text-sm">
            <p>hello@TraveMe.com</p>
            <p>(+62) 8700 0222 098</p>
            <p>Jakarta 456, Indonesia</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">GENERAL</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/work">How It's Work</Link></li>
                <li><Link href="/testimonials">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">ABOUT</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/destinations">Destinations</Link></li>
                <li><Link href="/culture">Culture</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">RESOURCE</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/content">Free Content</Link></li>
                <li><Link href="/glossary">Glossary</Link></li>
                <li><Link href="/tutorials">Tutorials</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}