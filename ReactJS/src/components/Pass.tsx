import * as React from "react";

import image from "../../test_image.png";
import PrintPass from "@/components/PrintPass";

export class Pass extends React.PureComponent<any> {
  constructor(props: any) {
    super(props);
    this.state = { checked: false };
  }

  render() {
    const { printPassData } = this.props;
    return <PrintPass printPassData={printPassData} />;
  }
}

export const PassPrint = React.forwardRef((props: any, ref: any) => {
  // eslint-disable-line max-len
  return <Pass ref={ref} printPassData={props.printPassData} />;
});
