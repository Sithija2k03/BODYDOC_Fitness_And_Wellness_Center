import React, {useState, useEffect} from 'react'
import axios from "axios";

const URL = "http://localhost:8070/phamacyInventory";

const fetchHandler = async() =>{
    return await axios.get(URL).then((res) => res.data);
}

function PhamacyInventory() {

    const[user,setUsers] = useState();
    useEffect(() => {
        fetchHandler().then((data) => setUsers(data.users));
    },[]);
  return (
       
    <div>
        <Header/>
        <div>
            {user && user.map((user,i) => (
                <div key = {i}>
                    <User user = {user}/>
                    </div>
            ))}
        </div>
    </div>
/* <form>
      <label>User Name:</label>
      <input type="text" placeholder="Enter your name" />

      <label>Doctor Name:</label>
      <input type="text" placeholder="Enter your doctor name" />

      <label>Time-slot:</label>
      <input type="email" placeholder="Enter your email" />

      <label>Date:</label>
      <input type="date" />

      <label>Status:</label>
      <select>
        <option>Pending</option>
        <option>Confirmed</option>
        <option>Cancelled</option>
        <option>Completed</option>
      </select>

      <button type="submit">Submit</button>
    </form> */
  )
}

export default PhamacyInventory;
