'use client'
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ListMagnifyingGlass } from "@phosphor-icons/react";
export default function SearchBar() {
    const handleSearch = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.open(`https://www.google.com/search?q=${(e.currentTarget[0] as HTMLInputElement).value}`);  
    }
    return (
        <form onSubmit={handleSearch} className="flex justify-between items-center w-full p-2 border rounded-md shadow-sm">
            <Input type="text" className="border-none shadow-none mr-2 font-medium focus:rounded-md text-lg py-4 focus-visible:rounded-md" placeholder="Search Google"/>
            <Button type="submit" variant={'ghost'} className="p-0">
                <span className="sr-only">Search</span>
                <ListMagnifyingGlass size={42}/>
            </Button>
        </form>
    )
}