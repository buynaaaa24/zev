import React from "react";
import { Meteors } from "@/components/ui/meteor";

export default function MeteorsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Card 1 - 1000+ Шалгалт */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-6 shadow-xl">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-blue-500/30 bg-blue-100 dark:bg-blue-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 text-blue-600 dark:text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h1 className="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white">
            1000+ Шалгалт
          </h1>

          <p className="relative z-10 mb-3 text-sm font-normal text-gray-600 dark:text-gray-400">
            Олон төрлийн хичээлийн шалгалтууд бэлэн байна
          </p>

          <Meteors number={20} />
        </div>
      </div>

      {/* Card 2 - Автомат Оношилгаа */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-green-500 to-emerald-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-6 shadow-xl">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-green-500/30 bg-green-100 dark:bg-green-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 text-green-600 dark:text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Автомат Оношилгаа
          </h1>

          <p className="relative z-10 mb-3 text-sm font-normal text-gray-600 dark:text-gray-400">
            Шууд үр дүн болон дэлгэрэнгүй тайлбар
          </p>

          <Meteors number={20} />
        </div>
      </div>

      {/* Card 3 - Хурдан Хариу */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-purple-500 to-violet-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-6 shadow-xl">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-purple-100 dark:bg-purple-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 text-purple-600 dark:text-purple-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h1 className="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Хурдан Хариу
          </h1>

          <p className="relative z-10 mb-3 text-sm font-normal text-gray-600 dark:text-gray-400">
            Секундэд шалгалт дуусч үр дүн гарна
          </p>

          <Meteors number={20} />
        </div>
      </div>

      {/* Card 4 - Статистик Мэдээлэл */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-6 shadow-xl">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/30 bg-orange-100 dark:bg-orange-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 text-orange-600 dark:text-orange-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h1 className="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Статистик Мэдээлэл
          </h1>

          <p className="relative z-10 mb-3 text-sm font-normal text-gray-600 dark:text-gray-400">
            Дэлгэрэнгүй гүйцэтгэлийн шинжилгээ
          </p>

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
