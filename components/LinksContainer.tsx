'use client'
import { links } from "@/lib/linksArray";
import LinkCard from "./LinkCard";
export default function LinksContainer(){
    return(
        <div className="grid sm:grid-cols-3 grid-cols-1 lg:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 p-2 border rounded-md">
            {links.map((link, index) => (
                <LinkCard key={index} title={link.title} link={link.href} IconSource={link.iconSrc}/>
            ))}
        </div>
    )
}