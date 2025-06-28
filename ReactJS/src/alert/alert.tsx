import { Toast } from "primereact/toast";

export default function AppAlert(props: any) {
  const { toast } = props;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 100000
      }}
    >
      <Toast position="bottom-right" ref={toast} />
    </div>
  );
}
