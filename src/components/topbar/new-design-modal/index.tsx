import Button from "@/components/button";
import Modal from "@/components/modal";

interface Props {
  onClose: ()=> void;
}

export default function NewDesignModal({onClose}: Props) {
  return (
    <Modal
      open={true}
      title='New Design'
      onClose={onClose}
      footer={(
        <div>
          <Button>Cancel</Button>
          <Button>Submit</Button>
        </div>
      )}
    >
      new design
    </Modal>
  );
}
