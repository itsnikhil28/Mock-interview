import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ModalProps {
    title: string
    description: string
    isopen: boolean
    onclose: () => void
    children?: React.ReactNode
}

const Modal = ({title,description,isopen,onclose,children} : ModalProps) => {
    const onchange = (open:boolean) =>{
        if(!open){
            onclose()
        }
    }
    return (
        <Dialog open={isopen} onOpenChange={onchange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    )
}

export default Modal