import { Button, ButtonProps } from "antd";
import { ReactNode } from "react";
import { lilitaOne } from "@/app/utils/fonts";

interface Props {
    dataType: 'table' | 'document' | 'tasks';
    onSelect: (type: string ) => void;
    children?: ReactNode;
}

export default function ActionButton({dataType, onSelect, children}: Props) {
    
    return(
    <Button onClick={() => onSelect(dataType)} type="primary" className={`${lilitaOne.className}`}>
        {children}
    </Button>
    )
}