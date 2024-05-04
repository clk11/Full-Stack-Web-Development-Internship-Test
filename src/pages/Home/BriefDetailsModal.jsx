import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import style from './modalStyles';

const BriefDetailsModal = ({ open, setOpen, data }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (data)
            setLoading(false);
    }, [data]);

    const strongColor = '#007bff';

    return (
        <>
            {!loading && (
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <>
                            <Typography variant="h5" align="center" style={{ fontStyle: 'oblique', marginBottom: '2rem' }}>{data.name}</Typography>
                            {data.recipesContainingIngredient !== undefined && (
                                <Typography variant="h6" align="center">
                                    There are <strong style={{ color: strongColor }}>{data.recipesContainingIngredient}</strong> recipes that contain this ingredient
                                </Typography>
                            )}
                            {data.recipesWritten !== undefined && (
                                <Typography variant="h6" align="center">
                                    <strong style={{ color: strongColor }}>{data.name}</strong> wrote <strong style={{ color: strongColor }}>{data.recipesWritten}</strong> recipes
                                </Typography>
                            )}
                            {data.skill !== undefined && (
                                <>
                                    <Typography variant="h6" align="center">
                                        Recipe that requires <strong style={{ color: strongColor }}>{data.ingredients_number}</strong> ingredients
                                    </Typography>
                                    <Typography variant="h6" align="center">
                                        Difficulty : <strong style={{ color: strongColor }}>{data.skill}</strong>
                                    </Typography>
                                </>

                            )}
                        </>
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default BriefDetailsModal;
