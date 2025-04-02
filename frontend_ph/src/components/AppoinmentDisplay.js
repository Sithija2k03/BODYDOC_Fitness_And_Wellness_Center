import React from 'react';


function AppoinmentDisplay(props) {

    const { appoinment_id,
        user_name,
        doctor_name,
        date,
        time_slot } = props.appoinment;


    return (

        <div>

            <h1>User display</h1>
            <br />
            <h1>Appoinment_ID:{appoinment_id}</h1>
            <h1>User name:{user_name}</h1>
            <h1>Doctor Name:{doctor_name}</h1>
            <h1>Date:{date}</h1>
            <h1>Time slot:{time_slot}</h1>
        </div>

    )
}



export default AppoinmentDisplay;
