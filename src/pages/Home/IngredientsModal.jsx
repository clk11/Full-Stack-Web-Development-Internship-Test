import React, { useState } from 'react';
import { Box, Modal, TextField, Button, Chip, Grid } from '@mui/material';
import style from './modalStyles';

const IngredientsModal = ({ setIngredientsModalOpen, ingredientsModalOpen, filterByIngredients, helperVisibility, setHelperVisibility }) => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        if (newItem.trim() !== '') {
            const results = newItem.toLowerCase().split(/[^a-zA-Z0-9]/).filter(Boolean);
            setItems([...items, ...results]);
            setNewItem('');
        }
    }

    const handleClearAll = () => {
        setItems([]);
        setNewItem('');
    }

    const onSearch = async () => {
        if (items.length !== 0) {
            setIngredientsModalOpen(false);
            await filterByIngredients(items);
        } else
            setIngredientsModalOpen(false);
    }
    return (
        <Modal
            open={ingredientsModalOpen}
            onClose={() => setIngredientsModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <>
                    <Grid
                        container
                        spacing={1.5}
                        direction="column"
                        justifyContent="flex-start"
                    >
                        <Grid item>
                            <h2 style={{ textAlign: 'center' }}>Add the ingredients to search by</h2>
                        </Grid>
                        <Grid item>

                            <TextField
                                label="Ingredient name"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                            />
                            {helperVisibility && (
                                <p onClick={() => setHelperVisibility(false)} style={{ color: 'grey', fontSize: '0.8rem' }}>
                                    To add a new ingredient to filter by, enter the name of the ingredient and press 'Add'. Repeat this process for all the ingredients and then press search.
                                    <br />
                                    You can always come back and modify the filtering parameters here.
                                    <br />
                                    <strong>Click on this label to close it.</strong>
                                </p>
                            )}
                        </Grid>
                        <Grid item>
                            <Button sx={{ mr: 2 }} onClick={handleAddItem} variant="contained" color="primary">
                                Add
                            </Button>
                            <Button onClick={handleClearAll} variant="contained" color="error">
                                Clear
                            </Button>
                        </Grid>
                        <Grid item>
                            {items.map((item, index) => (
                                <Chip key={index} label={item} style={{ marginRight: '5px', marginBottom: '5px' }} />
                            ))}
                        </Grid>
                    </Grid>
                </>
                <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button variant='contained' color='secondary' onClick={onSearch}>Search</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default IngredientsModal;
