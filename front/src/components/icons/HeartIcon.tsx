// import React from 'react';

// export const HeartIcon = () => (
//     <div style={{ position: 'relative', width: '50px', height: '50px' }}>
//         <img
//             src="/corazon.png"
//             alt="corazon"
//             width="50px"
//             height="50px"
//             style={{ position: 'absolute', top: 0, left: 0 }}
//         />
//         <img
//             src="/dragon.png"
//             alt="dragon"
//             width="35px"
//             height="35px"
//             style={{ position: 'absolute', top: 9, left: 10 }}
//         />
//     </div>
// );


import React from 'react';

export const HeartIcon = () => (
    <div style={{
        position: 'relative',
        width: '10vw',
        maxWidth: '50px',
        height: '10vw',
        maxHeight: '50px',
        minWidth: '30px',
        minHeight: '30px',
    }}>
        <img
            src="/corazon.png"
            alt="corazon"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}
        />
        <img
            src="/dragon.png"
            alt="dragon"
            style={{
                position: 'absolute',
                top: '18%',
                left: '20%',
                width: '70%',
                height: '70%',
            }}
        />
    </div>
);

