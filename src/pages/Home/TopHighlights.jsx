import React, { useEffect, useState } from 'react';
import { Box, Card, Container, Grid, Stack, Typography, Button } from '@mui/material';
import { Divider } from '@mui/material';
import BriefDetailsModal from './BriefDetailsModal';
const Section = ({ title, item }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const displayInfo = (e) => {
        setData(item[e.target.id]);
        setOpen(true);
    }
    return (
        <>
            <Grid item xs={12} sm={6} md={4} height={'auto'}>
                <BriefDetailsModal data={data} open={open} setOpen={setOpen} />
                <Stack
                    direction="column"
                    color="inherit"
                    component={Card}
                    spacing={1}
                    useFlexGap
                    sx={{
                        p: 3,
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'grey.800',
                        background: 'transparent',
                    }}
                >
                    <div style={{ display: 'inline-block', height: '100%' }}>
                        <Typography sx={{ textAlign: 'center', fontStyle: 'oblique', fontWeight: 'bold' }} fontWeight="large" gutterBottom>
                            {title}
                        </Typography>
                        <Divider sx={{ borderWidth: '1px', fontStyle: 'bold' }} />
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            spacing={2}
                            sx={{ pt: 2 }}
                        >
                            {item.map((element, elementIndex) => (
                                <Grid item key={elementIndex}>
                                    <Button id={elementIndex} onClick={displayInfo}>{element.name}</Button>
                                    <Divider sx={{ borderWidth: '1.5px' }} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </Stack>
            </Grid>

        </>
    )
}

const TopHighlights = ({ topData }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (topData) {
            setLoading(false);
        }
    }, [topData])
    return (
        <>
            {!loading ? (
                <Box
                    id="highlights"
                    sx={{
                        pt: { xs: 4, sm: 12 },
                        pb: { xs: 8, sm: 16 },
                        color: 'black',
                    }}
                >
                    <Typography sx={{ textAlign: 'center', marginBottom: '3rem', fontWeight: 'bold' }} component="h2" variant="h4">
                        HIGHLIGHTS
                    </Typography>
                    <Container
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: { xs: 3, sm: 6 },
                        }}
                    >
                        <Grid container spacing={4}>
                            <Section title={"Top 5 most complex recipes"} item={topData.recipes} />
                            <Section title={"Top 5 most common ingredients"} item={topData.ingredients} />
                            <Section title={"Top 5 most prolific authors"} item={topData.authors} />
                        </Grid>
                    </Container>
                </Box >
            ) : (
                <h1>Loading</h1>
            )}
        </>
    );
}

export default TopHighlights;
