import React from 'react';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TablePaginationActions = ({ count, page, onPageChange }) => {
    const theme = useTheme();
    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={(e) => { onPageChange(e, 0); }}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={(e) => { onPageChange(e, page - 1); }}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={(e) => { onPageChange(e, page + 1); }}
                disabled={page >= Math.ceil(count / 20) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={(e) => { onPageChange(e, Math.max(0, Math.ceil(count / 20) - 1)); }}
                disabled={page >= Math.ceil(count / 20) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default TablePaginationActions;