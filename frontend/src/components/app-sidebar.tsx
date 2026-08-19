// @ts-nocheck

import { BookOpen, Library, FileText, Palette } from "lucide-react";
import { useEffect } from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "Book Writer",
        email: "writer@formy.app",
        avatar: "/avatars/user.jpg",
    },
    navMain: [
        {
            title: "Library",
            url: "#",
            icon: Library,
            isActive: true,
            items: [
                {
                    title: "All Books",
                    icon: BookOpen,
                    url: "/books",
                    isActive: false,
                },
            ],
        },
        {
            title: "Resources",
            url: "#",
            icon: Palette,
            isActive: false,
            items: [
                {
                    title: "Formats",
                    icon: FileText,
                    url: "/formats",
                    isActive: false,
                },
                {
                    title: "Themes",
                    icon: Palette,
                    url: "/themes",
                    isActive: false,
                },
            ],
        },
    ],
};

export function AppSidebar() {
    const url = window.location.href;
    const currentPage = url.split("/").pop();

    function setActiveMenuItem(menus: any) {
        for (const menu of menus) {
            menu.isActive = false;
            for (const subMenu of menu.items) {
                if (subMenu.url === "/" + currentPage) {
                    subMenu.isActive = true;
                    menu.isActive = true;
                } else {
                    subMenu.isActive = false;
                }
            }
        }
    }

    useEffect(() => {
        setActiveMenuItem(data.navMain);
    }, [currentPage]);

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex flex-row items-center px-4 py-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold ml-2 text-xl">
                        Formy
                    </span>
                </div>
                <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground">Book Writing & Management</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
