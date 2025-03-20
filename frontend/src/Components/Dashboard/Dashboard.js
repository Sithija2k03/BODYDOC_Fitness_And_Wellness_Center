import React from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";

function Dashboard() {
    return (

        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-container">
                        
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`

`;

export default Dashboard;