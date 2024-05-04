import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, Chip, Grid } from '@mui/material';
import ProgressBar from '../../layout/ProgressBar';
import axios from 'axios';
import style from './modalStyles';
import Gauge from './Gauge';
const host = import.meta.env.VITE_API_URL;

const ChipList = ({ title, items }) => {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                <Typography component="span" sx={{ fontWeight: 'bold' }}>{title}:</Typography>
            </Typography>
            {items.length !== 0 ? (
                items.map((item, index) => (
                    <Chip key={index} label={item} style={{ marginRight: '5px', marginBottom: '5px' }} />
                ))
            ) : (
                <Typography component="span">No {title.toLowerCase()} found</Typography>
            )}
        </>
    );
}


const DetailsModal = ({ setOpen, open, data, highlighted }) => {
    const [loading, setLoading] = useState(true);
    const [additionalDetails, setAdditionalDetails] = useState(null);
    const [similarRecipes, setSimilarRecipes] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const result = await axios.get(`${host}/additional_details/${data.name}`);
            const result2 = await axios.get(`${host}/get_similarity_percentage/${data.name}`);
            setAdditionalDetails(result.data[0]);
            setSimilarRecipes(result2.data);
            console.log(result2.data);
            setLoading(false);
        }
        if (data)
            fetch();
    }, [data])

    const check_hit = (current) => {
        if (highlighted !== null) {
            const splited = current.toLowerCase().split(/[^a-zA-Z0-9]/).filter(Boolean);
            return splited.some(item1 => {
                return highlighted.some(item2 => {
                    return item2.includes(item1);
                });
            });
        } else return false
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {loading ? (
                    <ProgressBar />
                ) : (
                    <>
                        <Grid container>
                            <Grid item>
                                <Typography sx={{ textAlign: 'center' }} variant="h5" gutterBottom>
                                    {data.name}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <Typography component="span" sx={{ fontWeight: 'bold' }}>Description:</Typography> {data.description}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <Typography component="span" sx={{ fontWeight: 'bold' }}>Preparation Time:</Typography> {data.preparationTime.low / 60 + ' min'}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <Typography component="span" sx={{ fontWeight: 'bold' }}>Cooking Time:</Typography> {data.cookingTime.low / 60 + ' min'}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    <Typography component="span" sx={{ fontWeight: 'bold' }}>Ingredients:</Typography>
                                </Typography>
                                {data.ingredients.map((ingredient, index) => (
                                    <Chip key={index} label={ingredient} style={{ marginRight: '5px', marginBottom: '5px', color: check_hit(ingredient) ? 'blue' : 'black' }} />
                                ))}
                            </Grid>
                            <Grid item>
                                <ChipList title="Keywords" items={additionalDetails.keywords} />
                                <ChipList title="Collections" items={additionalDetails.collections} />
                                <ChipList title="Diet types" items={additionalDetails.dietTypes} />
                            </Grid>
                            <Grid item container direction="column" justifyContent="center" alignItems="center">
                                <Grid item>
                                    <Typography variant="subtitle1" sx={{ pt: 2, pb: 2 }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Other similar recipes to check out with their similarity percentage</Typography>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {similarRecipes.map((recipe, index) => (
                                        <Grid key={index} container direction="column" justifyContent="center" alignItems="center" spacing={1} sx={{ border: '1px solid black', borderRadius: 5, padding: 1, marginBottom: 2, width: '20rem' }}>
                                            <Grid item>
                                                <Typography variant="subtitle3" gutterBottom>
                                                    <Typography component="span" sx={{ fontSize: '0.9rem' }}>{recipe.name}</Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Gauge percentage={Math.floor(recipe.SimilarityPercentage)} />
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Box>
        </Modal >
    );
}

export default DetailsModal;
