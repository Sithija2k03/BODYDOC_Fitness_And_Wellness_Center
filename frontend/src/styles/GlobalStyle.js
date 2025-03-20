import{createGlobalStyle} from 'styled-componets'

export const GlobalStyle = createGlobalStyle`
   *{
      margin: 0;
      padding: 0;
      box-sizing: boarder-box;
      list-style: none;
    }
  
    :root{
       --primary-color: #222260;
       --primary-color2: rgba(34 , 34 , 96 , .6)';    
       --primary-color3: rgba(34 , 34 , 96 , .4)';
       --color-green: #e42AD00;
       --color-grey: #aaa;
       --color-accent: #F56692;  
   }

   body{
       font-family: 'Nunito', sans-serif;
       font-size: clamp(1rem, 1.5vw, 1.2rem);
       overflow: hidden;
       color: rgba(34 , 34 , 96 , .6)';
   }

`;