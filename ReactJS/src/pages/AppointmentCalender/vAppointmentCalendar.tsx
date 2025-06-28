import AppointmentsCalendar from "@/components/Common/CalendarDetail";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {fetch,} from "@/redux/slices/visitorManagement/CalendarSlice";



const VAppointmentCalendar = () => {
  const dispatch: any = useDispatch();
  const [calendarData,setCalendarData]=useState([])
  const getAll = () => {
    const data = {
      PlantId: +localStorage["PlantId"] ,
      CompanyId: +localStorage["CompanyId"] ,
      UserId: +localStorage["UserId"] ,
    };
    const dataFetched = dispatch(fetch(data)); 
    dataFetched
      .then((res) => {
        if (res.payload.AppointmentList) {
         setCalendarData( res.payload.AppointmentList); 
        }
      })
      .catch((err) => {
        console.log(err.message);
      });   
  }
  useEffect(()=>{
    getAll()
    console.log(calendarData);
  },[])

  

  return (
    <div className="page-container">
    <div className="inner-page-container">
      <div className="page-title">
        <div className="grid grid-nogutter">
          <div className="md:col-6">
            <h1>Appointment</h1>
          </div>
          <div className="md:col-6 text-right"></div>
        </div>
      </div>
      <div className="form-container scroll-y">
        <div className="white p10">
          <AppointmentsCalendar calendarData={calendarData}/>
        </div>
      </div>
    </div>
  </div>

  );
};

export default VAppointmentCalendar;
