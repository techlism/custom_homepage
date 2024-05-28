'use client'
import { links } from "@/lib/linksArray";
import LinkCard from "./LinkCard";
export default function LinksContainer(){
    return(
        <div className="grid grid-cols-3  gap-4 lg:gap-6 xl:gap-6 2xl:gap-6 p-2 border rounded-md">
            {links.map((link, index) => (
                <LinkCard key={index} title={link.title} link={link.href} IconSource={link.iconSrc}/>
            ))}
        </div>
    )
}