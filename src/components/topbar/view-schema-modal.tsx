import Modal from "@/components/modal";
import {useEditor} from '@/editor'
import MonacoEditor from '@monaco-editor/react'
import Loading from '@/components/loading'

interface Props {
  onClose: ()=> void;
}

export default function ViewSchemaModal({onClose}: Props) {
  const {canvas}=useEditor()
  const code=JSON.stringify(canvas?.canvas?.toJSON(), null, 2)
  
  return (
    <Modal
      open={true}
      title='View design schema'
      onClose={onClose}
    >
      <MonacoEditor
        height='80vh'
        value={code}
        defaultLanguage='javascript'
        loading={<Loading />}
        options={{
          readOnly: true
        }}
      />
    </Modal>
  );
}
