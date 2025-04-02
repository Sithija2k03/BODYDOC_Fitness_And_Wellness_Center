import React , {useState, useEffect } from 'react'
import axios from 'axios';
import AppoinmentDisplay from './AppoinmentDisplay';


function GloabalAppoinment(){
    
    const [appoinments,setAppoinments] = useState([]);

    useEffect(() => {
        function getAppoinments(){
            axios.get("http://localhost:8070/appoinments").then((res) => {
                setAppoinments(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }
        getAppoinments();
    } , [])

return(
    
  <div>
    <h1>Appointment </h1>
    <div>
    {appoinments && appoinments.map ((appoinment,i) =>(
       <div key = {i}>
        <AppoinmentDisplay appoinment = {appoinment}/>
        </div>
    ))}
  </div>
  </div>
);
 
}

export default GloabalAppoinment;   
