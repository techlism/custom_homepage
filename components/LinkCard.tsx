'use client'
import { Icon } from "@phosphor-icons/react";
import Link from "next/link";
type LinkCardProps = {
    title: string;
    link: string;
    IconSource:Icon;
};

export default function LinkCard({
    title,
    link,
    IconSource,
}: LinkCardProps){
    return (
        <Link href={link}>
            <div className="border p-2 rounded-md bg-card hover:shadow-md transition-all ease-in-out flex items-center align-middle justify-between hover:scale-105">
                <IconSource weight="regular" size={42} className="text-primary"/>
                <div className="w-[2px] h-10 rounded-sm bg-secondary" />
                <div className="text-left w-[50%] font-medium">
                    <p className="text-lg">{title}</p>
                </div>
            </div>
        </Link>
    );
}
