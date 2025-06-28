export const AppLayout = (props) => {
  const { children } = props;

  return (
    <>
      <div>header</div>
      <div>side Nav</div>
      <>{children}</>
    </>
  );
};
