import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Grid, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, TableHead, TableFooter, Button } from '@mui/material';
import TablePaginationActions from './TablePaginationActions';
import { v4 } from 'uuid'
import axios from 'axios';
import DetailsModal from './DetailsModal';
import ProgressBar from '../../layout/ProgressBar'
import IngredientsModal from './IngredientsModal';
import SortByIngredientsNumberIcon from '@mui/icons-material/SwapVert';
import SortBySkillIcon from '@mui/icons-material/FilterList';
import TopHighlights from './TopHighlights';
import TopPanel from './TopPanel';

const host = import.meta.env.VITE_API_URL;

const columns = [
    { id: 'name', label: 'Name' },
    { id: 'author', label: 'Author' },
    { id: 'ingredients_number', label: 'Number of ingredients', sort: true },
    { id: 'skill', label: 'Skill', sort: true },
    { id: 'details', label: 'View the recipe details' },
]

const Home = () => {
    const [highlighted, setHighlighted] = useState(null);
    const [searchedData, setSearchedData] = useState(null);
    const [rows, setRows] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [ingredientsModalOpen, setIngredientsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const tableRef = useRef(null);
    const [ascendingIngredients, setAscendingIngredients] = useState(true);
    const [ascendingSkill, setAscendingSkill] = useState(false);
    const [skillLevels, setSkillLevels] = useState(null);
    const [topDataVisible, setTopDataVisible] = useState(false);
    const [topData, setTopData] = useState(null);
    const [helperVisibility, setHelperVisibility] = useState(true);
    useEffect(() => {
        const fetch = async () => {
            const result = await axios.get(`${host}/data/200`);
            setRows(result.data);
            setLoading(false);
            setSkillLevels(new Map([
                ["Easy", 1],
                ["More effort", 2],
                ["A challenge", 3]
            ]));
        }
        fetch();
    }, [])

    useEffect(() => {
        if (topData) {
            setTopDataVisible(true);
            goDown();
        }
    }, [topData]);

    useEffect(() => {
        if (searchInput.length === 0) {
            setSearchedData(null);
            setHighlighted(null);
        }
        else filterByRecipe();
    }, [searchInput])

    function goDown() {
        setTimeout(() => {
            window.scrollTo({
                top: tableRef.current.offsetTop + tableRef.current.clientHeight,
                behavior: "smooth"
            });
        }, [1000])
    }

    const getTop5 = async () => {
        document.getElementById('going_down').innerText = 'Processing ...';
        if (!topDataVisible) {
            let mostComplexRecipies = [];
            mostComplexRecipies = await (searchedData === null ? [...rows] : searchedData).sort((x, y) => {
                const skillLevelX = skillLevels.get(x.skill);
                const skillLevelY = skillLevels.get(y.skill);
                return skillLevelX - skillLevelY;
            });
            mostComplexRecipies = mostComplexRecipies.sort((x, y) => y.ingredients.length - x.ingredients.length);
            mostComplexRecipies = mostComplexRecipies.slice(0, 5).map(x => {
                return {
                    name: x.name,
                    skill: x.skill,
                    ingredients_number: x.ingredients.length
                }
            }).reverse();
            const mostProlificAuthors = await axios.get(`${host}/most_prolific_authors`);
            const mostCommonIngredients = await axios.get(`${host}/most_common_ingredients`);
            setTopData({ authors: mostProlificAuthors.data, ingredients: mostCommonIngredients.data, recipes: mostComplexRecipies });
        } else goDown();
        document.getElementById('going_down').innerText = 'Check out the highlights';
    }

    const seeDetails = (index) => {
        setData(searchedData !== null ? searchedData[20 * page + index] : rows[20 * page + index]);
        setOpen(true);
    }

    const filterByIngredients = async (items) => {
        setHighlighted(items);
        if (page !== 0) setPage(0);
        const results = await (searchedData === null ? rows : searchedData).filter(row => {
            const ingredients = row.ingredients.map(x => x.toLowerCase());
            return items.some(item1 => {
                return ingredients.some(item2 => {
                    return item2.includes(item1);
                });
            });
        })
        setSearchedData(results);
    }

    const filterByRecipe = async () => {
        if (page !== 0) setPage(0);
        const inputSplited = searchInput.toLowerCase().split(/[^a-zA-Z0-9]/).filter(Boolean);

        const results = await (searchedData === null ? rows : searchedData).map(row => {
            const rowSplited = row.name.toLowerCase().split(/[^a-zA-Z0-9]/).filter(Boolean);
            let score = 0;
            inputSplited.forEach(keyword => {
                if (rowSplited.includes(keyword)) {
                    score++;
                }
            });
            return { ...row, score };
        });
        results.sort((a, b) => b.score - a.score);
        setSearchedData(results);
    }

    const filterByAuthors = async (author) => {
        if (page !== 0) setPage(0);
        const results = await rows.filter(x => x.author === author);
        setSearchedData(results);
    }

    const sortByColumns = async (column) => {
        let results = [];
        if (column === 'ingredients_number') {
            results = await (searchedData === null ? [...rows] : searchedData).sort((x, y) =>
                ascendingIngredients ? (x.ingredients.length - y.ingredients.length) : (y.ingredients.length - x.ingredients.length));
            setAscendingIngredients(!ascendingIngredients);
        } else {
            results = await (searchedData === null ? [...rows] : searchedData).sort((x, y) => {
                const skillLevelX = skillLevels.get(x.skill);
                const skillLevelY = skillLevels.get(y.skill);
                return ascendingSkill ? skillLevelX - skillLevelY : skillLevelY - skillLevelX;
            });
            setAscendingSkill(!ascendingSkill);
        }
        setSearchedData(results)
    }

    return (
        <div>
            {!loading ? (
                <div style={{ padding: 10 }}>
                    <TopPanel
                        getTop5={getTop5}
                        setSearchedData={setSearchedData}
                        setSearchInput={setSearchInput}
                        setIngredientsModalOpen={setIngredientsModalOpen}
                        searchInput={searchInput}
                        searchedData={searchedData}
                        setHighlighted={setHighlighted}
                    />
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 5 }}>
                        <IngredientsModal helperVisibility={helperVisibility} setHelperVisibility={setHelperVisibility} filterByIngredients={filterByIngredients} ingredientsModalOpen={ingredientsModalOpen} setIngredientsModalOpen={setIngredientsModalOpen} />
                        <DetailsModal setRows={setRows} highlighted={highlighted} open={open} setOpen={setOpen} data={data} />
                        <TableContainer sx={{ maxHeight: '37.5rem' }} ref={tableRef}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={v4()}
                                                align={column.align}
                                                style={{ backgroundColor: '#385170', color: 'white' }}
                                            >
                                                {column.label}
                                                {column.sort && (
                                                    <IconButton onClick={() => { sortByColumns(column.id) }}>
                                                        {column.id === "ingredients_number" ? (
                                                            <SortByIngredientsNumberIcon style={{ color: 'white' }} />
                                                        ) : (
                                                            <>
                                                                {ascendingSkill ? (
                                                                    <SortBySkillIcon id="sortBySkill" style={{ color: 'white', transform: 'rotate(180deg)' }} />
                                                                ) : (
                                                                    <SortBySkillIcon id="sortBySkill" style={{ color: 'white' }} />
                                                                )}
                                                            </>
                                                        )}
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(searchedData === null ? rows : searchedData)
                                        .slice(page * 20, page * 20 + 20)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={v4()} >
                                                    <TableCell>
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.author.length !== 0 ? (
                                                            <Button id={row.author} onClick={(e) => { filterByAuthors(e.target.id) }} >{row.author}</Button>
                                                        ) : (
                                                            <h1 style={{ marginLeft: '3rem', color: 'red' }}>-</h1>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.ingredients.length}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.skill}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => { seeDetails(index) }} color='secondary' variant="outlined">Recipe details</Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[20]}
                                            colSpan={3}
                                            count={searchedData === null ? rows.length : searchedData.length}
                                            rowsPerPage={20}
                                            page={page}
                                            onPageChange={(e, newPage) => { tableRef.current.scrollTop = 0; setPage(newPage); }}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Paper>
                    {topDataVisible && (
                        <TopHighlights topData={topData} />
                    )}
                </div>
            ) : (
                <ProgressBar />
            )}
        </div >
    );
}

export default Home;
