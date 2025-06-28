import React, { useEffect, useState } from "react";
import {
    Appslogo,
    Brandlogo,
    AvatarImg,
    WidgetHdrBG,
} from "../assets/css/img-library";
import {
    useRef,
    InputText,
    Menu,
    AutoComplete,
    Dropdown,
    Button,
    Toast,
} from "../assets/css/prime-library";
import { MenuItem } from "primereact/menuitem";
import { useDispatch, useSelector } from "react-redux";
import { getHeaderGateList, logout } from "@/redux/slices/common/authSlice";
import { useHistory } from "react-router-dom";
import { pageLoadScript } from "../assets/js/common-utilities";
import { AutoCompleteChangeEvent } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import FormFields from "@/components/FormFields";
import { useFormik } from "formik";
import {
    approvalUpdateLevel,
    approvalupdate,
    checkOutTimer,
    poppupFetch,
    poppupUpdate,
} from "@/redux/slices/master/workFlowSlice";
import AppAlert from "@/alert/alert";
import { fetch } from "@/redux/slices/DashBoard/DashBoardSlice";
import QRScanner from "@/components/QRScanner/QRScanner";
import QrScanner from "qr-scanner";
import { checkTrial, genErr, tLDS } from "@/utils/utilFunc";
import {
    CheckIn,
    CheckInCkeckoutPageLoad,
    CheckOut,
    FilterVisitorEntryCode,
} from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import { sendCheckOutTimer } from "@/redux/slices/master/commonSlice";
import { AppProgressSpinner } from "@/components/UtilityComp";

const Header = () => {
    const toast = useRef<Toast>(null);
    const dispatch: any = useDispatch();
    const menuRight: any = useRef<Menu>(null);
    const scannerInp: any = useRef(null);
    const route = useHistory();

    const [sessionClearTimer, setSessionClearTimer] = useState<NodeJS.Timeout>();
    const [trialClearTimer, setTrialClearTimer] = useState<NodeJS.Timeout>();
    const [approvalTimer, setApprovalTimer] = useState<NodeJS.Timeout>();
    const [checkOutInformTimer, setCheckOutInformTimer] =
        useState<NodeJS.Timeout>();

    const [filteredScreens, setFilteredScreens] = useState<any[]>();
    const [searchedQuery, setSearchedQuery] = useState();

    const [isDisabledSave, setIsDisabledSave] = useState<any>(false);
    const [GateList, setGateList] = useState();
    const [selectedGate, setSelectedGate] = useState<any>();

    const [plantList, setPlantList] = useState();
    const [selectedPlant, setSelectedPlant] = useState<any>();
    const [visible, setVisible] = useState(false);
    const [poppupObj, setpoppupObj] = useState<any>({});
    const [position, setPosition] = useState("center");
    const { loading, user, gateList } = useSelector((state: any) => state.auth);
    const { loadingW } = useSelector((state: any) => state.workflow);
    const [scanned, setScannedText] = useState("");
    const [visitorList, setVisitorList] = useState([]);
    const [checkInOut, setCheckInOut] = useState(false);
    const videoElementRef = useRef(null);
    var qrScanner;

    const routePage = useHistory();
    useEffect(() => {
        pageLoadScript();
    });

    useEffect(() => {
        sessionWatcher();
        trialWatcher();
    }, []);

    // useEffect(() => {
    //   const video: HTMLVideoElement = videoElementRef.current;

    //   if (video && video != null) {
    //     qrScanner = new QrScanner(
    //       video,
    //       (result) => {
    //         setScannedText(result.data);
    //       },
    //       {
    //         returnDetailedScanResult: true,
    //         highlightScanRegion: true,
    //         highlightCodeOutline: true,
    //       }
    //     );
    //     if (qrScanner && qrScanner != null && checkInOut == true) {
    //       qrScanner.start();
    //     }
    //   }
    //   return () => {
    //     if (qrScanner && qrScanner != null && checkInOut == true) {
    //       qrScanner.stop();
    //     }
    //   };
    // }, [checkInOut]);

    // useEffect(() => {

    // }, [scanned]);

    const verifyCheckInOrOut = (e) => {
        var scannedCode = e.target.value.split(":")[0];
        var scannedDtlId = e.target.value.split(":")[1];

        let obj = {
            text: scannedCode,
            EntryType: 60,
            PlantId: +localStorage["PlantId"],
        };
        var result = dispatch(FilterVisitorEntryCode(obj));
        result
            .then((res) => {
                if (res.payload.tranStatus.result) {
                    let checkInCodes = res.payload.VisitorEntryCheckInCodeList;
                    let checkOutCodesL = res.payload.VisitorEntryCheckOutLCodeList;
                    let checkOutCodesM = res.payload.VisitorEntryCheckOutMCodeList;
                    let checkedInOutCodes = res.payload.VisitorEntryCheckedInOutCodeList;

                    let approvalCodes = res.payload.VisitorEntryAppovalList;

                    if (approvalCodes.length > 0) {
                        let approvedCheck = approvalCodes.filter(
                            (item) => item.DocumentNo == scannedCode
                        );
                        if (
                            approvedCheck &&
                            approvedCheck.length > 0 &&
                            approvedCheck[0].Status == 74
                        ) {
                            toast.current?.show({
                                severity: "warn",
                                summary: "Warning Message",
                                detail:
                                    "Please Approve the Visitor Entry to Start Check-In Process.",
                            });
                            return;
                        } else {
                            if (
                                checkedInOutCodes.length == 0 &&
                                checkInCodes.length == 0 &&
                                checkOutCodesL.length == 0 &&
                                checkOutCodesM.length == 0
                            ) {
                                toast.current?.show({
                                    severity: "warn",
                                    summary: "Warning Message",
                                    detail: "Invalid Code, Kindly Scan Valid Code",
                                });
                                return;
                            } else {
                                if (checkedInOutCodes && checkedInOutCodes.length > 0) {
                                    checkedInOutCodes.forEach((element) => {
                                        if (
                                            element.VisitorEntryCode == scannedCode &&
                                            element.VisitorEntryDetailId == scannedDtlId.toString()
                                        ) {
                                            toast?.current?.show({
                                                severity: "warn",
                                                summary: "Warning",
                                                detail: `This Visitor ${element.PersonName}-${element.VisitorEntryCode} is Already Checked Out`,
                                            });
                                            setScannedText("");
                                            return;
                                        }
                                    });
                                }

                                checkInCodes.forEach((element) => {
                                    if (
                                        checkInCodes &&
                                        checkInCodes.length > 0 &&
                                        scannedCode == element.VisitorEntryCode &&
                                        scannedDtlId == element.VisitorEntryDetailId.toString()
                                    ) {
                                        checkIn(e.target.value.split(":"));
                                    }
                                });

                                checkOutCodesL.forEach((element) => {
                                    if (
                                        checkOutCodesL &&
                                        checkOutCodesL.length > 0 &&
                                        scannedCode == element.VisitorEntryCode &&
                                        scannedDtlId == element.VisitorEntryDetailId.toString()
                                    ) {
                                        setScannedText("");
                                        toast?.current?.show({
                                            severity: "warn",
                                            summary: "Warning Message",
                                            detail: "kindly check-out after 10 seconds",
                                        });
                                        return;
                                    }
                                });

                                checkOutCodesM.forEach((element) => {
                                    if (
                                        checkOutCodesM &&
                                        checkOutCodesM.length > 0 &&
                                        scannedCode == element.VisitorEntryCode &&
                                        scannedDtlId == element.VisitorEntryDetailId.toString()
                                    ) {
                                        checkOut(e.target.value.split(":"));
                                    }
                                });
                            }

                            //
                            //
                            //
                            // let toCheckIn = true;
                            // let toCheckOut = false;
                            // let toCheckInOut = false;
                            // if (checkedInOutCodes && checkedInOutCodes.length > 0) {
                            //   checkedInOutCodes.forEach((element) => {
                            //     if (
                            //       element.VisitorEntryCode == scannedCode &&
                            //       element.VisitorEntryDetailId == scannedDtlId.toString()
                            //     ) {
                            //       toast?.current?.show({
                            //         severity: "error",
                            //         summary: "Error",
                            //         detail: "This Visitor is Already Checked Out",
                            //       });
                            //       toCheckIn = false;
                            //       toCheckOut = false;
                            //       toCheckInOut = true;
                            //       setScannedText("");
                            //       return;
                            //     } else {
                            //       toCheckOut = true;
                            //     }
                            //   });
                            // }

                            // if (toCheckIn) {
                            //   checkInCodes.forEach((element) => {
                            //     if (
                            //       checkInCodes &&
                            //       checkInCodes.length > 0 &&
                            //       scannedCode == element.VisitorEntryCode &&
                            //       scannedDtlId == element.VisitorEntryDetailId.toString()
                            //     ) {
                            //       checkIn(e.target.value.split(":"));
                            //       toCheckIn = true;
                            //     } else {
                            //       toCheckOut = true;
                            //       toCheckIn = false;
                            //     }
                            //   });
                            // }
                            // if (!toCheckInOut) {
                            //   checkOutCodes.forEach((element) => {
                            //     if (
                            //       checkOutCodes &&
                            //       checkOutCodes.length > 0 &&
                            //       scannedCode == element.VisitorEntryCode &&
                            //       scannedDtlId == element.VisitorEntryDetailId.toString()
                            //     ) {
                            //       checkOut(e.target.value.split(":"));
                            //     } else {
                            //       toCheckOut = false;
                            //       toCheckIn = false;
                            //     }
                            //   });
                            // }

                            // if (toCheckOut && !toCheckInOut && !toCheckIn) {
                            //   setScannedText("");
                            //   toast?.current?.show({
                            //     severity: "error",
                            //     summary: "Error Message",
                            //     detail: "Check Out Can not be done before 5 Minutes",
                            //   });
                            //   return;
                            // }
                        }
                    } else {
                        toast.current?.show({
                            severity: "error",
                            summary: "Error Message",
                            detail: "Invalid Code, Please Scan Valid Code",
                        });
                        return;
                    }
                } else {
                    toast?.current?.show({
                        severity: "error",
                        summary: "Error Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                }
            })
            .catch((error) => {
                toast?.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: JSON.stringify(error),
                });
            });
    };

    const checkIn = (visEntryData) => {
        let obj = {
            UserId: +localStorage["UserId"],
            VisitorEntryCode: visEntryData[0],
            VisitorEntryDetailId: visEntryData[1],
            Checkintime: tLDS(new Date()),
            type: "",
            CompanyId: +localStorage["CompanyId"],
            PlantId: +localStorage["PlantId"],
            RoleId: +localStorage["DefaultRoleId"],
        };
        const updateRes = dispatch(CheckIn(obj));
        updateRes
            .then((res) => {
                if (res.payload.tranStatus.result) {
                    setScannedText("");
                    dispatch(
                        CheckInCkeckoutPageLoad({
                            CompanyId: +localStorage["CompanyId"],
                            PlantId: +localStorage["PlantId"],
                        })
                    );
                    toast.current?.show({
                        severity: "success",
                        summary: "Success Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                    if (qrScanner && qrScanner != null && checkInOut == true) {
                        qrScanner.stop();
                    }
                } else {
                    setScannedText("");
                    dispatch(
                        CheckInCkeckoutPageLoad({
                            CompanyId: +localStorage["CompanyId"],
                            PlantId: +localStorage["PlantId"],
                        })
                    );
                    toast.current?.show({
                        severity: "error",
                        summary: "Error Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                }
            })
            .catch((error) => {
                dispatch(
                    CheckInCkeckoutPageLoad({
                        CompanyId: +localStorage["CompanyId"],
                        PlantId: +localStorage["PlantId"],
                    })
                );
                toast.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: JSON.stringify(error),
                });
            });
    };

    const checkOut = (visEntryData) => {
        let obj = {
            UserId: localStorage["UserId"],
            VisitorEntryCode: visEntryData[0],
            VisitorEntryDetailId: visEntryData[1],
            Checkouttime: tLDS(new Date()),
            type: "",
        };
        const updateRes = dispatch(CheckOut(obj));
        updateRes
            .then((res) => {
                if (res.payload.tranStatus.result) {
                    setScannedText("");
                    dispatch(
                        CheckInCkeckoutPageLoad({
                            CompanyId: +localStorage["CompanyId"],
                            PlantId: +localStorage["PlantId"],
                        })
                    );
                    toast.current?.show({
                        severity: "success",
                        summary: "Success Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                    if (qrScanner && qrScanner != null && checkInOut == true) {
                        qrScanner.stop();
                    }
                } else {
                    setScannedText("");
                    dispatch(
                        CheckInCkeckoutPageLoad({
                            CompanyId: +localStorage["CompanyId"],
                            PlantId: +localStorage["PlantId"],
                        })
                    );
                    toast.current?.show({
                        severity: "error",
                        summary: "Error Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                }
            })
            .catch((error) => {
                dispatch(
                    CheckInCkeckoutPageLoad({
                        CompanyId: +localStorage["CompanyId"],
                        PlantId: +localStorage["PlantId"],
                    })
                );
                toast.current?.show({
                    severity: "error",
                    summary: "Error Message",
                    detail: JSON.stringify(error),
                });
                setScannedText("");
            });
    };

    useEffect(() => {
        ApprovalPopupShow();
        // checkCheckoutTimer();
        getHeaderGate(+localStorage["PlantId"]);
    }, []);

    useEffect(() => {
        const dashboard = {
            Taskname: "SEARCHINITIALIZE",
            PlantId: localStorage["PlantId"],
            UserId: localStorage["UserId"],
            CompanyId: +localStorage["CompanyId"],
            RoleId: localStorage["DefaultRoleId"],
            Header: 1,
            FromDate: new Date().toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
            ToDate: new Date().toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
        };
        const result = dispatch(fetch(dashboard));
        result
            .then((res) => {
                if (res.payload.transtatus.result) {
                    setVisitorList(res.payload.HeaderList);
                }
            })
            .catch((err) => { });
    }, []);

    const checkCheckoutTimer = () => {
        setCheckOutInformTimer(
            setInterval(() => {
                let obj = {
                    UserId: +localStorage["UserId"],
                    CompanyId: +localStorage["CompanyId"],
                    PlantId: +localStorage["PlantId"],
                    RoleId: +localStorage["DefaultRoleId"],
                    Type: "CheckOutTimer",
                    DocumentCode: null,
                };
                // var result = dispatch(checkOutTimer(obj));
                // result
                //   .then((res) => {
                //     if (res.payload.tranStatus.result) {
                //       let tempCheckTimer = res.payload.CheckoutTimerList;
                //       if (tempCheckTimer && tempCheckTimer.length > 0) {
                //         // sendCutOffMessage(tempCheckTimer);
                //       }
                //     } else {
                //       toast.current?.show({
                //         severity: "error",
                //         detail: "Error",
                //         summary: res.payload.tranStatus.lstErrorItem[0].Message,
                //       });
                //       setVisible(false);
                //     }
                //   })
                //   .catch((error) => {
                //     toast.current?.show({
                //       severity: "error",
                //       detail: "Error",
                //       summary: JSON.stringify(error),
                //     });
                //   });
            }, 3000)
        );
    };

    const sendCutOffMessage = (vistors) => {
        let obj = {
            UserId: +localStorage["UserId"],
            PlantId: +localStorage["PlantId"],
            CompanyId: +localStorage["CompanyId"],
            RoleId: +localStorage["DefaultRoleId"],
            CheckOutTimerVis: vistors,
        };
        var result = dispatch(sendCheckOutTimer(obj));
        result
            .then((res) => {
                if (res.payload.tranStatus.result) {
                    if (
                        res.payload.workflowpopups &&
                        res.payload.workflowpopups.length > 0
                    ) {
                        setpoppupObj(res.payload.workflowpopups[0]);
                        setVisible(true);
                    }
                } else {
                    toast.current?.show({
                        severity: "error",
                        detail: "Error",
                        summary: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                    setVisible(false);
                }
            })
            .catch((error) => {
                toast.current?.show({
                    severity: "error",
                    detail: "Error",
                    summary: JSON.stringify(error),
                });
            });
    };
    const ApprovalPopupShow = () => {
        if (!visible) {
            setApprovalTimer(
                setInterval(() => {
                    let obj = {
                        UserId: +localStorage["UserId"],
                        PlantId: +localStorage["PlantId"],
                        RoleId: +localStorage["DefaultRoleId"],
                        Type: "PopupFetch",
                        DocumentCode: null,
                    };
                    var result = dispatch(poppupFetch(obj));
                    result
                        .then((res) => {
                            if (res.payload.tranStatus.result) {
                                if (
                                    res.payload.workflowpopups &&
                                    res.payload.workflowpopups.length > 0
                                ) {
                                    setpoppupObj(res.payload.workflowpopups[0]);
                                    setVisible(true);
                                }
                            } else {
                                toast.current?.show({
                                    severity: "warn",
                                    detail: "Warning",
                                    summary: res.payload.tranStatus.lstErrorItem[0].Message,
                                });
                                setVisible(false);
                            }
                        })
                        .catch((error) => {
                            toast.current?.show({
                                severity: "error",
                                summary: "Error",
                                detail: genErr(error),
                            });
                        });
                }, 30000)
            );
        }
    };
    useEffect(() => {
        if (
            localStorage.getItem("GateId") != "null" &&
            localStorage.getItem("GateId") != ""
        ) {
            setSelectedGate(+localStorage.getItem("GateId"));
        }
        if (localStorage.getItem("data_gateList")) {
            let gate = JSON.parse(localStorage["data_gateList"]);
            setGateList(gate);
            if (
                localStorage.getItem("GateId") != "null" &&
                localStorage.getItem("GateId") != ""
            ) {
                setSelectedGate(+localStorage.getItem("GateId"));
            } else {
                setSelectedGate(gate[0]?.GateId);
                localStorage.setItem("GateId", gate[0]?.GateId);
            }
        }
        if (localStorage.getItem("data_userbranchmapList")) {
            let plant = JSON.parse(localStorage["data_userbranchmapList"]);
            setPlantList(plant);
            if (localStorage.getItem("PlantId")) {
                setSelectedPlant(+localStorage.getItem("PlantId"));
            } else {
                setSelectedPlant(plant[0].PlantId);
                localStorage.setItem("PlantId", plant[0].GateId);
            }
        }
    }, []);

    const sessionWatcher = () => {
        if (!sessionClearTimer) {
            const intervalId = setInterval(() => {
                if (!checkUserId()) {
                    clearInterval(intervalId); // Clear the interval
                    sessionEnded(); // Call your session ended function
                }
            }, 1000);
            // setSessionClearTimer(
            //   setInterval(() => {
            //     if (!checkUserId()) {
            //       clearInterval(sessionClearTimer);
            //       sessionEnded();
            //     }
            //   }, 1000)
            // );
        }
    };

    const checkUserId = () => {
        const userId = localStorage.getItem("UserId");
        return userId && parseInt(userId);
    };

    const trialWatcher = () => {
        if (!trialClearTimer) {
            setTrialClearTimer(
                setInterval(() => {
                    // if (checkTrial()) {
                    //   sessionEnded();
                    //   clearInterval(trialClearTimer);
                    // }
                }, 1000)
            );
        }
    };
    const Approvalclose = (DocNo: string) => {
        let obj = {
            UserId: localStorage["UserId"],
            DocNo: DocNo,
            ApprovalDetailId: poppupObj["ApprovalDetailId"],
        };
        var result = dispatch(poppupUpdate(obj));
        result
            .then((res) => {
                if (res.payload.tranStatus.result) {
                    setVisible(false);
                } else {
                    toast.current?.show({
                        severity: "error",
                        detail: "Error",
                        summary: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                }
            })
            .catch((error) => {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: genErr(error),
                });
            });
    };
    const OnApprove = (poppupObj: any) => {
        setIsDisabledSave(true);
        let obj = {
            ApprovalRequest: {
                companyid: +localStorage["CompanyId"],
                plantid: +localStorage["PlantId"],
                requesterid: poppupObj.initiatedBy,
                documentno: poppupObj.DocumentNo,
                documentid: poppupObj.DocumentId,
                approvalid: null,
                approvaldetailid: null,
                documentdetailid: null,
                remarks1: formik.values.remarks,
                remarks2: formik.values.remarks,
                status: 75,
                approverid: +localStorage["UserId"],
                levelid: poppupObj.LevelId,
                alternateuser: null,
                parentid: null,
                userid: +localStorage["UserId"],
                requestfromdate: null,
                requesttodate: null,
                Isviewed: 1,
            },
        };
        servicecall(obj);
    };
    const OnReject = (poppupObj: any) => {
        setIsDisabledSave(true);
        let obj = {
            ApprovalRequest: {
                companyid: +localStorage["CompanyId"],
                plantid: +localStorage["PlantId"],
                requesterid: poppupObj.initiatedBy,
                documentno: poppupObj.DocumentNo,
                documentid: poppupObj.DocumentId,
                approvalid: null,
                approvaldetailid: null,
                documentdetailid: null,
                remarks1: formik.values.remarks,
                remarks2: formik.values.remarks,
                status: 76,
                approverid: +localStorage["UserId"],
                levelid: poppupObj.LevelId,
                alternateuser: null,
                parentid: null,
                userid: +localStorage["UserId"],
                requestfromdate: null,
                requesttodate: null,
                Isviewed: 1,
            },
        };
        servicecall(obj);
    };
    const servicecall = (obj: any) => {
        var result = dispatch(approvalupdate(obj));
        result
            .then((res) => {
                if (res.payload.Result.tranStatus.result) {
                    setIsDisabledSave(false);
                    toast.current?.show({
                        severity: "success",
                        summary: "Success Message",
                        detail: res.payload.Result.tranStatus.lstErrorItem[0].Message,
                    });
                    setVisible(false);
                } else {
                    setIsDisabledSave(false);

                    toast.current?.show({
                        severity: "warn",
                        summary: "Warning Message",
                        detail: res.payload.Result.tranStatus.lstErrorItem[0].Message,
                    });
                    setVisible(false);
                }
            })
            .catch((error) => {
                setIsDisabledSave(false);

                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: genErr(error),
                });
            });
    };

    // Approval Update Level
    const OnApproveLevel = (poppupObj: any) => {
        setIsDisabledSave(true);

        let obj = {
            ApprovalRequest: {
                companyid: +localStorage["CompanyId"],
                plantid: +localStorage["PlantId"],
                requesterid: poppupObj.initiatedBy,
                documentno: poppupObj.DocumentNo,
                documentid: poppupObj.DocumentId,
                documentactivityid: poppupObj.ApprovalActivityId,
                approvalid: null,
                approvaldetailid: null,
                documentdetailid: null,
                remarks1: formik.values.remarks,
                remarks2: formik.values.remarks,
                status: 75,
                approverid: +localStorage["UserId"],
                levelid: poppupObj.LevelId,
                alternateuser: null,
                parentid: null,
                userid: +localStorage["UserId"],
                requestfromdate: null,
                requesttodate: null,
                Isviewed: 1,
            },
        };
        servicecallLevel(obj);
    };
    const OnRejectLevel = (poppupObj: any) => {
        setIsDisabledSave(true);

        let obj = {
            ApprovalRequest: {
                companyid: +localStorage["CompanyId"],
                plantid: +localStorage["PlantId"],
                requesterid: poppupObj.initiatedBy,
                documentno: poppupObj.DocumentNo,
                documentid: poppupObj.DocumentId,
                documentactivityid: poppupObj.ApprovalActivityId,
                approvalid: null,
                approvaldetailid: null,
                documentdetailid: null,
                remarks1: formik.values.remarks,
                remarks2: formik.values.remarks,
                status: 76,
                approverid: +localStorage["UserId"],
                levelid: poppupObj.LevelId,
                alternateuser: null,
                parentid: null,
                userid: +localStorage["UserId"],
                requestfromdate: null,
                requesttodate: null,
                Isviewed: 1,
            },
        };
        servicecallLevel(obj);
    };
    const servicecallLevel = (obj: any) => {
        var result = dispatch(approvalUpdateLevel(obj));
        result
            .then((res) => {
                if (res.payload.tranStatus.result) {
                    setIsDisabledSave(false);

                    toast.current?.show({
                        severity: "success",
                        summary: "Success Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                    setVisible(false);
                } else {
                    setIsDisabledSave(false);

                    toast.current?.show({
                        severity: "warn",
                        summary: "Warning Message",
                        detail: res.payload.tranStatus.lstErrorItem[0].Message,
                    });
                    setVisible(false);
                }
            })
            .catch((error) => {
                setIsDisabledSave(false);

                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: genErr(error),
                });
            });
    };
    // Approval Update Level

    const formik: any = useFormik({
        initialValues: {
            Remarks: "",
        },
        onSubmit: (values: any, { resetForm }) => { },
    });

    const sessionEnded = () => {
        const logOutRes = dispatch(logout({}));
        logOutRes
            .then((res) => {
                if (!res.error && res.payload.tranStatus.result) {
                    route.push("/");
                } else {
                    route.push("/");
                }
                clearIntervals();
            })
            .catch((err) => {
                clearIntervals();
                route.push("/");
            });
    };

    const clearIntervals = () => {
        clearInterval(approvalTimer);
        // clearInterval(sessionClearTimer)
        clearInterval(trialClearTimer);
    };

    const items: MenuItem[] = [
        {
            label: "Logout",
            icon: "pi pi-power-off",
            command: () => {
                const logOutRes = dispatch(logout({}));
                logOutRes
                    .then((res) => {
                        if (!res.error) {
                            if (res.payload.tranStatus.result == true) {
                                route.push("/");
                                clearIntervals();
                            }
                        } else {
                            route.push("/");
                            clearIntervals();
                        }
                    })
                    .catch((err) => { });
            },
        },
    ];

    const filterScreens = (event) => {
        let filtered: any[] = [];
        let query = event.query;
        if (localStorage.getItem("data_userscreenmapList").length > 0) {
            let _screens = JSON.parse(localStorage["data_userscreenmapList"]);
            for (let i = 0; i < _screens.length; i++) {
                let screen = _screens[i];
                if (
                    screen.childscreenname.toLowerCase().indexOf(query.toLowerCase()) == 0
                ) {
                    filtered.push(screen);
                }
            }
        }

        setFilteredScreens(filtered);
    };

    const goToPage = (event) => {
        if (!event.value || event.value != null) {
            route.push(event.value.childscreenurl);
        }
    };

    const getHeaderGate = (plantId) => {
        let obj = {
            PlantId: plantId,
        };
        var result = dispatch(getHeaderGateList(obj));
        result.then((res) => { }).catch((err) => { });
    };

    const screenCompleteTemp = (item) => {
        return (
            <>
                <span className="search-name">
                    {item.childscreenname}
                    <div className="search-category">in {item.parentscreenname}</div>
                </span>
            </>
        );
    };

    const handleInstantCio = () => {
        scannerInp?.current.focus();
        checkInOut == true ? setCheckInOut(false) : setCheckInOut(true);
        if (scannerInp) {
            scannerInp?.current.focus();
        }
    };

    const handleScannerCode = (event) => {
        clearTimeout(timerId);
        // setScannedText(event.target.value);
        timerId = setTimeout(() => {
            scannedFunction(scanned, event);
        }, 1000);
    };

    let timerId;

    const scannedFunction = (scannedValue, event) => {
        if (event.target.value && event.target.value != "") {
            setScannedText(event.target.value);
            let scannedValue = {
                target: {
                    value: event.target.value,
                },
            };
            verifyCheckInOrOut(scannedValue);
            event.target.value = null;
        }
    };

    const footerContent = (
        <div>
            <Button
                label="Approve"
                severity="success"
                title="Approve"
                icon="las la-check"
                className="mr-2 p-1"
                disabled={isDisabledSave}
                loading={isDisabledSave}
                onClick={() =>
                    poppupObj.DocumentId == 34
                        ? OnApprove(poppupObj)
                        : OnApproveLevel(poppupObj)
                }
            />
            <Button
                label="Reject"
                severity="danger"
                title="Reject"
                icon="las la-check"
                className="mr-2 p-1"
                disabled={isDisabledSave}
                loading={isDisabledSave}
                onClick={() =>
                    poppupObj.DocumentId == 34
                        ? OnReject(poppupObj)
                        : OnRejectLevel(poppupObj)
                }
            />
        </div>
    );
    return (
        <>
            <div>
                <header className="web-view header">
                    <div className="grid">
                        <div className="col-12 md:col-8 lg:col-8">
                            <div className="apps-logo text-center inline-block pt-3 bg-white">
                                <img className="w-full" src={Appslogo} alt="logo" />
                            </div>

                            <div className="hdr-search p10 inline-block align-top">
                                <div className="hdr-search-input p015">
                                    <Dropdown
                                        value={selectedPlant}
                                        onChange={(e) => {
                                            localStorage.setItem("PlantId", e.value);
                                            // localStorage["toReload"] = "true";
                                            window.location.reload();
                                            setSelectedPlant(e.value);
                                            getHeaderGate(e.value);
                                        }}
                                        options={plantList}
                                        optionValue="PlantId"
                                        optionLabel="PlantName"
                                        placeholder="Select Plant"
                                        className="w-full"
                                        filter={true}
                                    />
                                </div>
                            </div>
                            <div className="hdr-search p10 inline-block align-top">
                                <div className="hdr-search-input p015">
                                    <Dropdown
                                        value={selectedGate}
                                        onChange={(e) => {
                                            localStorage.setItem("GateId", e.value);
                                            // localStorage["toReload"] = "true";
                                            window.location.reload();
                                            setSelectedGate(e.value);
                                        }}
                                        options={gateList}
                                        optionValue="GateId"
                                        optionLabel="GateName"
                                        placeholder="Select Gate"
                                        className="w-full"
                                        filter={true}
                                    />
                                </div>
                            </div>
                            <div className="hdr-search p10 inline-block align-top">
                                <div className="hdr-search-input p015">
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-search" />
                                        <AutoComplete
                                            field="childscreenname"
                                            suggestions={filteredScreens}
                                            completeMethod={filterScreens}
                                            value={searchedQuery}
                                            onChange={(e) => setSearchedQuery(e.value)}
                                            placeholder="Search"
                                            onSelect={goToPage}
                                            itemTemplate={screenCompleteTemp}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4 lg:col-4 text-right">
                            <div className="inline-block mt10">
                                <div className="time flex">
                                    <div className="flex align-items-center justify-content-center hrs"></div>
                                    <div className="flex align-items-center justify-content-center min"></div>
                                    <div className="flex align-items-center justify-content-center sec"></div>
                                    <div className="flex align-items-center justify-content-center ampm"></div>
                                </div>
                            </div>
                            <div className="hdr-login p10 inline-block">
                                <a
                                    onClick={(event) => menuRight.current.toggle(event)}
                                    aria-controls="popup_menu_right"
                                    aria-haspopup
                                >
                                    <img
                                        src={
                                            localStorage["data_UserHeader"] &&
                                                JSON.parse(localStorage["data_UserHeader"])
                                                    .UserImageUrl &&
                                                JSON.parse(localStorage["data_UserHeader"])
                                                    .UserImageUrl != "" &&
                                                JSON.parse(localStorage["data_UserHeader"])
                                                    .UserImageName &&
                                                JSON.parse(localStorage["data_UserHeader"])
                                                    .UserImageName != ""
                                                ? JSON.parse(localStorage["data_UserHeader"])
                                                    .UserImageUrl
                                                : AvatarImg
                                        }
                                        alt="avatar"
                                        className="vertical-align-middle"
                                    />
                                    {/* <span
                    className="white-space-nowrap vertical-align-middle inline-block overflow-hidden text-overflow-ellipsis hdr-login-text"
                    style={{ maxWidth: "200px" }}
                  >
                    {localStorage["UserName"]}
                  </span>
                  <span
                    className="white-space-nowrap vertical-align-middle inline-block overflow-hidden text-overflow-ellipsis hdr-login-text"
                    style={{ maxWidth: "200px" }}
                  >
                    {localStorage.getItem("data_LoggedRole")
                      ? JSON.parse(localStorage["data_LoggedRole"]).RoleName
                      : ""}
                  </span> */}
                                    <span
                                        className="white-space-nowrap vertical-align-middle inline-block overflow-hidden text-overflow-ellipsis hdr-login-text"
                                        style={{
                                            maxWidth: "200px",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "16px",
                                                textAlign: "left",
                                                color: "white",
                                            }}
                                        >
                                            {localStorage["UserName"]}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "white" }}>
                                            {localStorage.getItem("data_LoggedRole")
                                                ? JSON.parse(localStorage["data_LoggedRole"]).RoleName
                                                : ""}
                                        </div>
                                    </span>

                                    <i className="pi pi-angle-down vertical-align-middle"></i>
                                </a>
                                <Menu
                                    model={items}
                                    popup
                                    ref={menuRight}
                                    id="popup_menu_right"
                                    popupAlignment="right"
                                />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="instant-widget fixed">
                    <div className="cube">
                        <div className="cube__face cube-face--bottom shadow"></div>
                        <div className="cube__face cube-face--front">
                            Total Visitors
                            <br />
                            <a href="#" className="text">
                                {visitorList.map((visitor, index) => (
                                    <div key={index} style={{ fontSize: "36px" }}>
                                        {visitor.Individual}
                                    </div>
                                ))}
                            </a>
                        </div>
                        <div className="cube__face cube-face--right">
                            Check-In Visitors
                            <br />
                            <a href="#" className="text">
                                {visitorList.map((visitor, index) => (
                                    <div key={index} style={{ fontSize: "36px" }}>
                                        {visitor.checkedIn}
                                        {/* {visitor.hasOwnProperty("checkedInAll") ? visitor.checkedInAll : visitor.checkedIn} */}
                                    </div>
                                ))}
                            </a>
                        </div>
                        <div className="cube__face cube-face--back">
                            Check-Out Visitors
                            <br />
                            <a href="#" className="text">
                                {visitorList.map((visitor, index) => (
                                    <div key={index} style={{ fontSize: "36px" }}>
                                        {visitor.checkedOut}
                                    </div>
                                ))}
                            </a>
                        </div>
                        <div className="cube__face cube-face--left">
                            Total Contractors
                            <br />
                            <a href="#" className="text">
                                {visitorList.map((visitor, index) => (
                                    <div key={index} style={{ fontSize: "36px" }}>
                                        {visitor.Contractor}
                                    </div>
                                ))}
                            </a>
                        </div>
                        <div className="cube__face cube-face--bottom"></div>
                    </div>
                </div>
                <div
                    className="instant-checkout fixed"
                    onClick={() => handleInstantCio()}
                >
                    <a title="Instant Check-Out">
                        <i className="las la-door-open"></i>
                    </a>
                </div>
                <div className="checkout-widget">
                    <div
                        className="widget-hdr"
                        style={{ backgroundImage: "url(" + WidgetHdrBG + ")" }}
                    >
                        <div className="sub-title">
                            <div className="grid">
                                <div className="col-12">
                                    <h2>Instant Check In / Out</h2>
                                </div>
                            </div>
                        </div>
                        <a
                            className="widget-close"
                            title="Close"
                            onClick={() => {
                                setCheckInOut(false);
                                setScannedText("");
                            }}
                        >
                            <i className="las la-times-circle"></i>
                        </a>
                    </div>
                    <div className="widget-body">
                        <div className="normal-table">
                            <div className="grid">
                                <div className="col-12">
                                    <label className="form-label">
                                        Check In/ Out <span className="hlt-txt">*</span>
                                    </label>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: "15px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {/* <QRScanner
                      scanned={scanned}
                      setScannedText={setScannedText}
                      videoElementRef={videoElementRef}
                    /> */}
                                        <InputText
                                            className="w-full"
                                            ref={scannerInp}
                                            id="scannerInput"
                                            style={{
                                                opacity: 1,
                                                backgroundColor: "#f0f0f0",
                                            }}
                                            onChange={handleScannerCode}
                                            placeholder={"Please Scan the QR Code"}
                                            autoComplete="new-password"
                                            autoFocus={false}
                                        // value={scanned.split(":")[0]}
                                        />
                                        <i
                                            className="pi pi-arrow-circle-right"
                                            style={{ fontSize: "2rem", color: "#0268d8" }}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="widget-ftr text-center">
            <Button
              label="Save"
              title="Save"
              className="preview-save"
              icon="pi pi-save"
            />
            <Button
              label="Cancel"
              severity="danger"
              className="preview-close"
              title="Cancel"
              icon="pi pi-times-circle"
            />
          </div> */}
                </div>
            </div>
            <Dialog
                header={
                    "Approval For " +
                    poppupObj["FunctionName"] +
                    " ( " +
                    poppupObj["DocumentNo"] +
                    " ) "
                }
                visible={visible}
                position="bottom-right"
                style={{ width: "50vw" }}
                onHide={() => Approvalclose(poppupObj["DocumentNo"])}
                footer={footerContent}
                draggable={false}
                resizable={false}
            >
                <FormFields
                    type={"textarea"}
                    name={"Remarks"}
                    label={"Remarks"}
                    options={""}
                    show={true}
                    required={false}
                    disable={false}
                    optionLabel={""}
                    optionValue={""}
                    handleSelect={""}
                    maxLength="500"
                    formik={formik}
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                />
            </Dialog>
            <AppAlert toast={toast} />
            {loadingW && <AppProgressSpinner />}
        </>
    );
};

export default Header;
