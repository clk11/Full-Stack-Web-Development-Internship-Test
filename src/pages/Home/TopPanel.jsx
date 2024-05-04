import React from 'react';
import { Button, Grid, TextField } from '@mui/material';

const TopPanel = ({ getTop5, setSearchedData, setSearchInput, setIngredientsModalOpen, searchInput, searchedData, setHighlighted }) => {
    return (
        <Grid
            sx={{ pb: 2 }}
            container
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Grid item sx={{ display: 'flex', textAlign: 'start' }}>
                <Button id='going_down' color='secondary' sx={{ fontWeight: 'bold' }} onClick={getTop5}>
                    Check out the highlights
                </Button>
            </Grid>
            <Grid item>
                <TextField
                    style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', width: '25rem' }}
                    onChange={(e) => { setSearchInput(e.target.value); }}
                    value={searchInput}
                    hiddenLabel
                    id="filled-hidden-label-small"
                    variant="outlined"
                    placeholder='Enter the recipe name'
                    size='small'
                />
            </Grid>
            <Grid item>
                <Button sx={{ fontWeight: 'bold' }} onClick={() => { setIngredientsModalOpen(true); }}>Filter by ingredients</Button>
            </Grid>
            {(searchedData !== null) && (
                <Grid item>
                    <Button sx={{ color: 'red' }} onClick={() => { setSearchedData(null); setSearchInput(''); setHighlighted(null) }}>Clear</Button>
                </Grid>
            )}
        </Grid>
    );
}

export default TopPanel;
