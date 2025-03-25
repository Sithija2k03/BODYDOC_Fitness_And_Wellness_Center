import React from 'react'

function Order() {
  return (
<form>
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
    </form>
  )
}

export default Order;
