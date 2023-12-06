import { useState, useEffect } from "react";

const Random = () => {
    // const [strokeColor, setStrokeColor] = useState('blue');

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         const newColor = getRandomColor();
    //         setStrokeColor(newColor);
    //     }, 5000); // Change color every 1000 milliseconds (1 second)

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, []); // Empty dependency array ensures the effect runs only once on component mount

    // const getRandomColor = () => {
    //     return '#' + Math.floor(Math.random() * 16777215).toString(16);
    // };


    return (
        <svg
            version="1.1"
            id="Layer_1"
            viewBox="0 0 32 32"
            space="preserve"
            width="50px"
            height="50px"
            class="w-14 h-14 hover:cursor-pointer stroke-1"
            // stroke={strokeColor}
            // fill={strokeColor}
            style={{ transition: 'stroke 1s ease-in-out' }}
        >
            <g
                id="SVGRepo_bgCarrier"
                strokeWidth="0"

            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    id="random--samples_1_"
                    d="M31.255,11.746l-11-11c-0.141-0.141-0.369-0.141-0.51,0l-11,11c-0.141,0.141-0.141,0.368,0,0.509 l2.386,2.386H1c-0.199,0-0.36,0.161-0.36,0.36v16c0,0.199,0.161,0.36,0.36,0.36h16c0.199,0,0.36-0.161,0.36-0.36V20.87l2.385,2.385 c0.07,0.07,0.163,0.105,0.255,0.105s0.185-0.035,0.255-0.105l11-11C31.396,12.114,31.396,11.886,31.255,11.746z M16.64,30.64H1.36 V15.36h15.28V30.64z M20,22.491l-2.64-2.641V15c0-0.199-0.161-0.36-0.36-0.36h-4.851L9.509,12L20,1.509L30.491,12L20,22.491z M14,19 c0,0.552-0.448,1-1,1s-1-0.448-1-1s0.448-1,1-1S14,18.448,14,19z M20,6c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S20.552,6,20,6 z M20,11c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S20.552,11,20,11z M15,11c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1 S15.552,11,15,11z M25,11c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S25.552,11,25,11z M20,16c-0.552,0-1,0.448-1,1s0.448,1,1,1 s1-0.448,1-1S20.552,16,20,16z M9,22c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S9.552,22,9,22z M5,26c-0.552,0-1,0.448-1,1 s0.448,1,1,1s1-0.448,1-1S5.552,26,5,26z"
                ></path>
            </g>
        </svg>
    );
};
export default Random;
