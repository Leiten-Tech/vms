import React from "react";
import emailjs from "emailjs-com";

export const sendEmail = (obj) => {
  try {
    let emailPublicKey = process.env.EMAILJS_PUBLIC_KEY
    
    
    // const emailInit = emailjs.init(process.env.EMAILJS_PUBLIC_KEY);
    const emailInit = emailjs.init(emailPublicKey);
    

    emailjs
      .send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        obj
      )
      .then(
        (result) => {
          
        },
        (error) => {
          
        }
      );

    // emailjs
    //   .send("service_m7ex9nu", "template_m5vvrng", {
    //     from_name: "From Visitor Management (Gate I)",
    //     whom_to_email: "rk5485353@gmail.com",
    //     message: "Approved visitor at Gate I",
    //   })
    //   .then(
    //     function () {
    //       
    //     },
    //     function (error) {
    //       
    //     }
    //   );
  } catch (err) {
    
  }
};
