"use client";

import { Suspense } from "react";
import { useRouter } from "nextjs-toploader/app";
import { notFound, usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";

interface TabsProfileProps {
  countQuestion?: number;
  countAnswer?: number;
}

export const TabsProfile = ({
  countAnswer,
  countQuestion,
}: TabsProfileProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "answers", label: "Jawaban", count: countAnswer },
    { id: "questions", label: "Pertanyaan", count: countQuestion },
  ];

  // Extract username from pathname
  const username = pathname.match(/\/@([^\/]+)/)?.[1];

  /**
   * If username not included in pathname, redirect to 404 page
   */

  if (!username) notFound();

  const handleTabChange = (tab: string) => {
    // Construct the new path based on the selected tab
    const newPath = username
      ? `/@${username}${tab === "overview" ? "" : `/${tab}`}`
      : pathname;

    router.push(newPath);
  };

  // Determine active tab based on current pathname
  const activeTab = pathname.endsWith("/answers")
    ? "answers"
    : pathname.endsWith("/questions")
      ? "questions"
      : "overview";

  return (
    <Suspense>
      <nav className="overflow-x-auto">
        <ul className="flex items-center gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={
                activeTab === tab.id
                  ? {
                    borderBottomWidth: "2px",
                    borderBottomColor: "var(--color-primary)",
                    borderBottomStyle: "solid",
                    color: "var(--color-primary)",
                  }
                  : {}
              }
              onClick={() => handleTabChange(tab.id)}
              className="inline-flex px-4 py-2 font-semibold text-muted-foreground transition-colors duration-200"
            >
              {tab.label}
              {tab.count != undefined && (
                <Badge variant="secondary" className="ml-2 rounded-full">
                  {new Intl.NumberFormat("en", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(tab.count)}
                </Badge>
              )}
            </button>
          ))}
        </ul>
      </nav>
    </Suspense>
  );
};

// "use client";

// import { notFound, usePathname } from "next/navigation";
// import { useRouter } from "nextjs-toploader/app";
// import { Suspense, useEffect, useRef, useState } from "react";

// import { MoreHorizontalIcon } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";

// interface TabsProfileProps {
//   countQuestion?: number;
//   countAnswer?: number;
// }

// export const TabsProfile = ({
//   countAnswer,
//   countQuestion,
// }: TabsProfileProps) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const tabsContainerRef = useRef<HTMLUListElement>(null);
//   const tabsRefs = useRef<(HTMLButtonElement | null)[]>([]);
//   const [visibleTabs, setVisibleTabs] = useState<boolean[]>([]);
//   const [hiddenTabs, setHiddenTabs] = useState<number[]>([]);
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);

//   // const { data: navbarCount, isLoading: isLoadingNavbarCount } =
//   //   trpc.users.getCountNavbar.useQuery();

//   const tabs = [
//     { id: "overview", label: "Overview" },
//     { id: "answers", label: "Jawaban", count: countAnswer },
//     { id: "questions", label: "Pertanyaan", count: countQuestion },
//   ];

//   // Extract username from pathname
//   const username = pathname.match(/\/@([^\/]+)/)?.[1];

//   /**
//    * If username not included in pathname, redirect to 404 page
//    */
//   if (!username) {
//     notFound();
//   }

//   // Determine active tab based on current pathname
//   const activeTab = pathname.endsWith("/answers")
//     ? "answers"
//     : pathname.endsWith("/questions")
//       ? "questions"
//       : "overview";

//   const handleTabChange = (tab: string) => {
//     // Construct the new path based on the selected tab
//     const newPath = username
//       ? `/@${username}${tab === "overview" ? "" : `/${tab}`}`
//       : pathname;

//     router.push(newPath);
//   };

//   // Function to check which tabs should be visible
//   const checkVisibility = () => {
//     if (!tabsContainerRef.current) return;

//     const containerWidth = tabsContainerRef.current.clientWidth;
//     const dropdownButtonWidth = 50;
//     const availableWidth = containerWidth - dropdownButtonWidth;

//     let currentWidth = 0;
//     let allTabsVisible = true;

//     const newVisibility = tabs.map((_, index) => {
//       const tabElement = tabsRefs.current[index];
//       const tabWidth = tabElement?.offsetWidth || 0;

//       currentWidth += tabWidth;
//       const isVisible = currentWidth <= availableWidth;

//       if (!isVisible) {
//         allTabsVisible = false;
//       }

//       return isVisible;
//     });

//     // Get indices of hidden tabs
//     const newHiddenTabs = newVisibility
//       .map((isVisible, index) => ({ isVisible, index }))
//       .filter((item) => !item.isVisible)
//       .map((item) => item.index);

//     setVisibleTabs(newVisibility);
//     setHiddenTabs(newHiddenTabs);

//     // Set dropdown visibility based on whether all tabs are visible
//     setShowDropdown(!allTabsVisible);
//   };

//   // Initialize tabs visibility
//   useEffect(() => {
//     // Initialize tabsRefs with the correct length
//     tabsRefs.current = tabsRefs.current.slice(0, tabs.length);

//     // Initialize visibility array
//     setVisibleTabs(new Array(tabs.length).fill(true));

//     // Check visibility after initial render
//     setTimeout(checkVisibility, 0);

//     // Add resize event listener
//     window.addEventListener("resize", checkVisibility);

//     return () => {
//       window.removeEventListener("resize", checkVisibility);
//     };
//   }, [tabs.length]);

//   // if (isLoadingNavbarCount) {
//   //   return (
//   //     <div className="flex h-[41.6px] flex-wrap gap-2 border-b">&nbsp;</div>
//   //   );
//   // }

//   return (
//     <Suspense>
//       <nav className="relative">
//         <ul
//           ref={tabsContainerRef}
//           className="flex items-center gap-2 overflow-hidden border-b"
//         >
//           {tabs.map((tab, index) => (
//             <button
//               key={tab.id}
//               ref={(el) => (tabsRefs.current[index] = el) as any}
//               style={
//                 !visibleTabs[index]
//                   ? { visibility: "hidden", position: "absolute" }
//                   : {}
//               }
//               onClick={() => handleTabChange(tab.id)}
//               className={cn(
//                 "inline-flex px-4 py-2 font-semibold text-muted-foreground transition-colors duration-200",
//                 activeTab === tab.id &&
//                   "border-b-2 border-primary text-primary",
//               )}
//             >
//               {tab.label}
//               {tab.count != undefined && (
//                 <Badge variant="secondary" className="ml-2 rounded-full">
//                   {new Intl.NumberFormat("en", {
//                     notation: "compact",
//                     compactDisplay: "short",
//                   }).format(tab.count)}
//                 </Badge>
//               )}
//             </button>
//           ))}

//           {showDropdown && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto w-[50px]">
//                   <MoreHorizontalIcon />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 {hiddenTabs.length > 0 && (
//                   <>
//                     {hiddenTabs.map((index) => (
//                       <DropdownMenuItem
//                         key={tabs[index].id}
//                         onClick={() => handleTabChange(tabs[index].id)}
//                       >
//                         {tabs[index].label}
//                         {tabs[index].count != undefined && (
//                           <Badge
//                             variant="secondary"
//                             className="ml-2 rounded-full"
//                           >
//                             {new Intl.NumberFormat("en", {
//                               notation: "compact",
//                               compactDisplay: "short",
//                             }).format(tabs[index].count)}
//                           </Badge>
//                         )}
//                       </DropdownMenuItem>
//                     ))}
//                     <DropdownMenuSeparator />
//                   </>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </ul>
//       </nav>
//     </Suspense>
//   );
// };
