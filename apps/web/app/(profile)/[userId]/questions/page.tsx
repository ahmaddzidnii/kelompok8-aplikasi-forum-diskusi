import Link from "next/link";
import React from "react";

const AnswersPage = () => {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <li
            key={index}
            className="flex flex-col gap-1.5 border-t px-2.5 py-3"
          >
            <Link href="#" className="text-base font-bold">
              Optimalisasi PHP atau ganti aja?
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold">2 Answers</p>
              <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnswersPage;
