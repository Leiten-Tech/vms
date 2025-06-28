export const WarningPop = (props) => {
  const { data, secData } = props;
  return (
    <div className="flex flex-row justify-content-center align-items-center h-full">
      <div className="align-items-center flex flex-row justify-content-center m-auto w-9 white p-5 border-round-3xl">
        <div className="col-12">
          <div className="card mb-0 text-center">
            <div className="flex justify-content-between mb-3">
              <div className="m-auto align-items-center bg-orange-100 border-round-lg flex justify-content-center p-3">
                <i className="pi pi-ban text-orange-500 text-xl"></i>
              </div>
            </div>
            <h1 className="text-black-500 text-3xl">{data}</h1>
            <span className="text-orange-700 text-2xl">{secData}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
