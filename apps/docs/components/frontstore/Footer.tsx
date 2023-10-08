import { Facebook, Instagram, Mail, Phone, Pin } from "lucide-react";
import React from "react";

import Link from "next/link";
import { navbarList } from "../../lib/db";

const Footer = ({ data }: { data: any }) => {
  return (
    <footer className="bg-gray-900 py-8 text-muted">
      <div className="container grid grid-cols-1 justify-between gap-4 px-4 lg:grid-cols-3">
        <div className="col-span-1 px-2">
          <h1>{data.name}</h1>
          <div className="mt-2 flex gap-2">
            {data.facebook && (
              <Link
                passHref
                target="_blank"
                href={data.facebook}
                className="rounded border p-2 hover:bg-white hover:text-gray-900"
              >
                <Facebook />
              </Link>
            )}
            {data.instagram && (
              <Link
                passHref
                target="_blank"
                href={data.instagram}
                className="rounded border p-2 hover:bg-white hover:text-gray-900"
              >
                <Instagram />
              </Link>
            )}
          </div>
        </div>

        <ul className="col-span-1 flex flex-wrap">
          {navbarList.map((el, i) => (
            <li key={i} className="p-0 px-2">
              <Link href={el.path} className="hover:underline">
                {el.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-span-1">
          <div>Contact Us: </div>
          {data.address && (
            <div className="mt-2 flex flex-row items-start">
              <Pin />
              <span className="ml-2 w-3/4">{data.address}</span>
            </div>
          )}
          {data.email && (
            <div className="mt-2 flex flex-row">
              <Mail /> <span className="ml-2">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="mt-2 flex flex-row">
              <Phone /> <span className="ml-2">{data.phone}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
