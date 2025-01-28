"use client"
import Name from '@/components/ui/name';
import MatrixRain from '../components/ui/MatrixRain';
import Card from '@/components/ui/card copy';
import Social from '@/components/ui/test';
import Link from 'next/link';
import Test from '@/components/ui/test';

export default function Home() {
  return (
    <div className="relative h-screen bg-black flex items-center justify-center gap-4 flex-col p-2">
      <MatrixRain />
      <div className='flex flex-col items-center justify-center z-20 w-full h-full'>
        <Name />
        <div className='mt-40 md:flex hidden'>
          <Card />

        </div>
        <div className='text-sm text-white md:hidden flex text-[10px]'>
          CA: Not posted yet!

        </div>
        <div className='mt-16 flex gap-6 flex-col md:flex-row items-center'>
          <Link href="/stress " >
            <Test name="Stress Test" />

          </Link>
          <Link href="/personality">
            <Test name="Personality Test" />

          </Link>

          <Link href="/">
            <Test name="Security Test" />
          </Link>

          <Link href="#">
            <Test name="Leaderboard" />
          </Link>

        </div>


      </div>

    </div>
  );
}
