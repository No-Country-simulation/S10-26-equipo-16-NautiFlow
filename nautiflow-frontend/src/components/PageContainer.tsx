
import type { ChildrenTypes } from "../types/index";

export default function PageContainer({children}:ChildrenTypes){
    return (
        <div className="flex min-h-screen w-full justify-center overflow-x-hidden py-0">
            <div className="container pt-8">{children}</div>
        </div>
    )
}