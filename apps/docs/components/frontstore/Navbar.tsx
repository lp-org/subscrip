"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";

import { navbarList } from "../../lib/db";
const Navbar = ({ data }: { data: any }) => {
  const [navIsShown, setnavIsShown] = useState(false);
  const toggleNavIsShown = () => {
    setnavIsShown((navIsShown) => !navIsShown);
  };
  const pathname = usePathname();
  return (
    <nav
      className={`${
        pathname === "/" ? "absolute bg-transparent" : "relative bg-gray-900"
      } left-0 top-0 z-10 flex h-20 w-full items-center justify-between  px-4 text-white`}
    >
      <Link href="/">
        <h1>{data.name}</h1>
      </Link>
      <ul className="hidden gap-6 md:flex">
        {navbarList.map((el, i) => (
          <li key={i}>
            <Link href={el.path}>{el.name}</Link>
          </li>
        ))}
      </ul>
      <div className="hidden md:flex">
        {data.facebook && (
          <Link target="_blank" passHref href={data.facebook} className="mx-2">
            <Facebook />
          </Link>
        )}
        {data.instagram && (
          <Link target="_blank" passHref href={data.instagram} className="mx-2">
            <Instagram />
          </Link>
        )}
      </div>
      {!navIsShown && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 md:hidden"
          onClick={toggleNavIsShown}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
          />
        </svg>
      )}
      {navIsShown && (
        <div className="absolute left-0 top-0 z-10 w-full bg-gray-900 px-4 py-6 text-white md:hidden">
          <div className="flex justify-between">
            <h1>{data.name}</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
              onClick={toggleNavIsShown}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <ul className=" mb-4">
            {navbarList.map((el, i) => (
              <li key={i} className="border-b-2 border-b-gray-600">
                <Link href={el.path}>{el.name}</Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-row gap-4">
            {data.facebook && (
              <Link target="_blank" passHref href={data.facebook}>
                <Facebook />
              </Link>
            )}
            {data.instagram && (
              <Link target="_blank" passHref href={data.instagram}>
                <Instagram />
              </Link>
            )}
          </div>
        </div>
      )}
      {navIsShown && (
        <button
          onClick={() => setnavIsShown(!navIsShown)}
          className="fixed inset-0 z-0 bg-black opacity-50 transition-opacity"
        />
      )}
    </nav>
  );
};

export default Navbar;
