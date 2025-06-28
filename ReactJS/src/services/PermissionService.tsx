export const permissionService: any = (props) => {
  const { screenId } = props;

  try {
    if (
      localStorage.getItem("data_Userrolemappedfunctionsviews").length > 0
    ) {
      const permittedScreens = JSON.parse(
        localStorage["data_Userrolemappedfunctionsviews"]
      );

      
      let screenAccess = permittedScreens.find(
          (funct: any) => funct.ScreenId == screenId
          );
      let _Action = {
        _functionId: screenId,
        _functionName: screenAccess.Screenname,
        _Add: screenAccess.Create,
        _Delete: screenAccess.Delete,
        _Update: screenAccess.Update,
        _View: screenAccess.View,
        _Approve: screenAccess.Approval,
        _Print: screenAccess.Print,
        _Series: screenAccess.Series,
        _PriceHistory: screenAccess.Pricehistory,
        _Profit: screenAccess.Profit,
      };
      return _Action;
    }
  } catch (err) {
    
  }
};
