import styled from "styled-component";
import bg from '.img/bg.png'

function App() {

  return (
    <AppStyled className = " App">
       <main>
        
       </main>
    </AppStyled>
  );
    <div>
     {/* <Header/> */}
    </div>
  
}
  const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
`;

export default App;
