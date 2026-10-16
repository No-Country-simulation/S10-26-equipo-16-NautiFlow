
import type { ChildrenTypes } from "../types/index";

export default function PageContainer({children}:ChildrenTypes){
    return (
        <div className="flex min-h-screen w-full justify-center overflow-x-hidden py-16">
            <div className="container p-4 ">{children}</div>
        </div>
    )
}