import Image from 'next/image';
import React from 'react';
import banner from "../public/banner.png";
function Banner() {
  return (
    <div className="flex items-center justify-between py-10 bg-pink-200 border-purple-500 rounded-r-full border-y lg:py-0">
        <div className="flex-1 px-10 spaxe-y-5">
            <h1 className="max-w-xl font-serif text-6xl">
                <span className="underline decoration-black decoration-4">Adenike talks health</span>{" "}  gives you everything about health and wellbeing
                </h1>
                <h1 className="py-2 my-10">
                        Health tips and updates for girls, ladies and women that encapsulates issues such as reproductive health tips, menstruation et al. Plus, contents are rich and free.
                </h1>
        </div>
        <div className="flex-1 hidden h-32 md:inline-flex lg:h-full">
            <Image className="hidden object-contain h-32 md:inline-flex lg:h-full" src={banner} alt="hero image"/>
        </div>
      
    </div>
  );
}

export default Banner;
