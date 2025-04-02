import React , {useState} from 'react'
import OrderForm from './order/OrderForm';

function GloabalOrders(){
    
    const [order,setOrders] = useState([]);

    return(
     
        <div>
            {/* import OrderForm */}
            <OrderForm/>
            <h1>Hi</h1>
            
        </div>
        
     

    );

}

export default GloabalOrders;