import { Loader2 } from "lucide-react"
import Modal from "./modal"
import { Button } from "./ui/button"

interface SaveModalProps {
  isopen: boolean
  onclose: () => void
  onconfirm: () => void
  loading: boolean
}

export const SaveModal = ({ isopen, onclose, onconfirm, loading }: SaveModalProps) => {
  return (
    <Modal title="Are you sure?" description="This action cannot be undone you can't edit or re-answer this" isopen={isopen} onclose={onclose}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onclose}>Cancel</Button>
        <Button disabled={loading} className="bg-emerald-600 hover:bg-emerald-800" onClick={onconfirm}> {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Continue"}</Button>
      </div>
    </Modal>
  )
}
