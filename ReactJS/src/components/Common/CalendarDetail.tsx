import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarPop from "./CalendarPop";

const AppointmentsCalendar = ({ calendarData }) => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [visible, setVisible] = useState(false);
  const handleclick = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const formattedEvents = calendarData.map((item) => ({
      title: (item.PersonName),
      start: new Date(item.ValidFrom),
      end: new Date(item.ValidTo),
      ...item,
    }));
    setEvents(formattedEvents);
    console.log(formattedEvents);
    
  }, [calendarData]);
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setVisible(true);
  };
  return (
    <>
      <div style={{ height: "80vh", margin: "20px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleEventClick} 
        />
      </div>
      <CalendarPop
        visible={visible}
        setVisible={setVisible}
        handleclick={handleclick}
        selectedEvent={selectedEvent} 
      />
    </>
  );
};


export default AppointmentsCalendar;
