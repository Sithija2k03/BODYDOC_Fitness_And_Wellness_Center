import { createGlobalStyle } from "styled-components";  

export const GlobalStyle = createGlobalStyle`
  body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          list-style: none;
}

    :root {
    --primary-color: #222260;
    ---primary-color2: 'color:' rgba(34, 34, 96, 0.6);
    ---primary-color3: 'color:' rgba(34, 34, 96, 0.4);
    --color-green: #42AD00;
    --color-grey: #aaa;
    --color-accent: #F56692;
    --color-delete: #FF0000;
    --color-dark-green:rgb(4, 50, 32);
          }

    body {
        font-family: 'Nunito', sans-serif;
        background-color: red;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        overflow: hidden;
        color:rgba(34, 34, 96, 0.6);
    }

    h1,h2,h3,h4,h5,h6 {
       color: var(--primary-color);
    }

    .error {
        color: var(--color-red);
        animation:shake 0.5s ease-in-out;
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(10px); }
            50% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }
    }

`;