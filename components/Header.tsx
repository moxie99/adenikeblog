import Link from 'next/link';
import Image from 'next/image'
import React from 'react';
import logo from "../public/logo.png"
function Header() {
  return (
    <header className="flex justify-between p-5 mx-auto max-w-7xl">
      <div className="flex items-center my-2 space-x-5">
        <Link href="/">
          <Image className="object-contain cursor-pointer w-44" src={logo} alt="logo" />
        </Link>
        <div className="items-center hidden space-x-5 md:inline-flex">
            <h3>About me</h3>
            <h3>Contact me</h3>
            <h3 className="px-5 py-2 text-white bg-pink-600 rounded-full">Follow me</h3>
          </div>
      </div>
      <div className="flex items-center space-x-5 text-purple-800">
        <h3>Sign In</h3>
        <h3 className="px-4 py-2 border border-pink-600 border-px-3 rounded-t-md">Get Started</h3>
      </div>
    </header>
  );
}

export default Header;
