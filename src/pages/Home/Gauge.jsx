import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
const Gauge = ({ percentage }) => {
    return (
        <div style={{ position: 'relative', width: 70, height: 70 }}>
            <CircularProgress
                variant="determinate"
                size={70}
                thickness={2}
                value={percentage}
                style={{ position: 'absolute' }}
            />

            <Typography
                variant="h7"
                component="div"
                style={{ fontSize: percentage === 100 ? '1.1rem' : '1rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
                {`${percentage}%`}
            </Typography>
        </div>
    );
};

export default Gauge;
