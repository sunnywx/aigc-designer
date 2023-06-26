import Modal from "@/components/modal";
import {useEditor} from '@/editor'

interface Props {
  onClose: ()=> void;
}


export default function ViewSchemaModal({onClose}: Props) {
  const {canvas}=useEditor()
  
  return (
    <Modal
      open={true}
      title='View design schema'
      onClose={onClose}
    >
      <pre>
        {JSON.stringify(canvas?.canvas?.toJSON(), null, 2)}
      </pre>
    </Modal>
  );
}
