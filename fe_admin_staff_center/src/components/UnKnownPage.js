import React from 'react'
import { Link } from 'react-router-dom'

const UnKnownPage = () => {
  return (
    <>
      <main>
        <h1>4<span><i class="fas fa-ghost"></i></span>4</h1>
        <h2>Error: 404 page not found</h2>
        <p>Sorry, the page you're looking for cannot be accessed</p>
        
      </main>
      <style>
        {`
        @import url("https://fonts.googleapis.com/css?family=Montserrat:400,400i,700");

        $bg: #313942;
        $ghost: #528cce;
        $heading: #e7ebf2;
        
        *,
        *:after,
        *:before {
          box-sizing: border-box;
        }
        
        body {
          background-color: $bg;
          font-family: 'Montserrat', sans-serif;
        }
        
        main {
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100vh;
          justify-content: center;
          text-align: center;
        }
        
        h1 {
          color: $heading;
          font-size: 12.5rem;
          letter-spacing: .10em;
          margin: .025em 0;
          text-shadow: .05em .05em 0 rgba(0,0,0,.25);
          white-space: nowrap;
          
          @media(max-width: 30rem) {
            font-size: 8.5rem;
          }
          
          & > span {
            animation: spooky 2s alternate infinite linear;
            color: $ghost;
            display: inline-block;
          }
        }
        
        h2 {
          color: $heading;
          margin-bottom: .40em;
        }
        
        p {
          color: #ccc;
          margin-top: 0;
        }
        
        @keyframes spooky {
          from {
            transform: translatey(.15em) scaley(.95);
          }
          
          to {
            transform: translatey(-.15em);
          }
        }
      `}
      </style>
    </>

  )
}

export default UnKnownPage