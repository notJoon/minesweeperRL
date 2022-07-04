import { MAX_COLS, MAX_ROWS, BOMBS } from "../constants";
import { CellValue, CellState, Cell } from "../types";

const grabAllAdjCells = (cells: Cell[][], rowParam: number, colParam: number) => {
    const topLeftCell = rowParam > 0 && colParam > 0 ? cells[rowParam-1][colParam-1] : null;
    const topCell = rowParam > 0 ? cells[rowParam-1][colParam] : null;
    const topRightCell = rowParam > 0 && colParam < MAX_COLS-1 ? cells[rowParam-1][colParam+1] : null;
    const leftCell = colParam > 0 ? cells[rowParam][colParam-1] : null;
    const rightCell = colParam < MAX_COLS-1 ? cells[rowParam][colParam+1] : null;
    const bottomLeftCell = rowParam < MAX_ROWS-1 && colParam > 0 ? cells[rowParam+1][colParam-1] : null;
    const bottomCell = rowParam < MAX_ROWS-1 ? cells[rowParam+1][colParam] : null;
    const bottomRightCell = rowParam < MAX_ROWS-1 && colParam < MAX_COLS-1 ? cells[rowParam+1][colParam+1] : null;
    
    return {
        topCell,
        topLeftCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomCell,
        bottomLeftCell,
        bottomRightCell,
    };
};

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];

    // generate cells
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.invisible 
            });
        }
    }

    // randomly put bombs
    let bombsPlaced = 0;
    while (bombsPlaced < BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
        
        const currCell = cells[randomRow][randomCol];
        if (currCell.value !== CellValue.bomb) {
            cells[randomRow][randomCol] = {
                ...cells[randomRow][randomCol],
                value: CellValue.bomb
            }
        };

        bombsPlaced++;
    };

    // calculate the each cell's value 
    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const currCell = cells[rowIndex][colIndex];

            if (currCell.value === CellValue.bomb) {
                continue
            }
            
            //! potential threat
            // count adjacent bombs for each `cell[row][col]`
            let numberOfBombs = 0;
            const {
                topLeftCell, 
                topCell, 
                topRightCell, 
                leftCell, 
                rightCell, 
                bottomLeftCell, 
                bottomCell, 
                bottomRightCell} = grabAllAdjCells(cells, rowIndex, colIndex);
            
            if (topLeftCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (topCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (topRightCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (leftCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (rightCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (bottomLeftCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (bottomCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (bottomRightCell?.value === CellValue.bomb) { numberOfBombs++; }
            if (numberOfBombs > 0) {
                cells[rowIndex][colIndex] = {
                    ...currCell,
                    value: numberOfBombs
                }
            }
        }
    }

    return cells;
};

// 인접한 모든 CellValue.none인 셀을 공개
export const openAdjCells = (
    cells: Cell[][], 
    rowParam: number, 
    colParam: number): Cell[][] => {
        const currentCell = cells[rowParam][colParam];

        if (
            currentCell.state === CellState.visible ||
            currentCell.state === CellState.flagged
        ) {
            return cells;
        }

        let newCells = cells.slice();
        newCells[rowParam][colParam].state = CellState.visible;

        const {
            topLeftCell, 
            topCell, 
            topRightCell, 
            leftCell, 
            rightCell, 
            bottomLeftCell, 
            bottomCell, 
            bottomRightCell} = grabAllAdjCells(cells, rowParam, colParam);

        if (topLeftCell?.state === CellState.invisible 
            && topLeftCell.value !== CellValue.bomb) {
                if (topLeftCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam-1, colParam-1);
                } else {
                    newCells[rowParam-1][colParam-1].state = CellState.visible;
            }
        }

        if (topCell?.state === CellState.invisible 
            && topCell.value !== CellValue.bomb) {
                if (topCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam-1, colParam);
                } else {
                    newCells[rowParam-1][colParam].state = CellState.visible;
            }
        }

        if (topRightCell?.state === CellState.invisible 
            && topRightCell.value !== CellValue.bomb) {
                if (topRightCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam-1, colParam+1);
                } else {
                    newCells[rowParam-1][colParam+1].state = CellState.visible;
            }
        }

        if (leftCell?.state === CellState.invisible 
            && leftCell.value !== CellValue.bomb) {
                if (leftCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam, colParam-1);
                } else {
                    newCells[rowParam][colParam-1].state = CellState.visible;
            }
        }

        if (rightCell?.state === CellState.invisible 
            && rightCell.value !== CellValue.bomb) {
                if (rightCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam, colParam+1);
                } else {
                    newCells[rowParam][colParam+1].state = CellState.visible;
            }
        }

        if (bottomLeftCell?.state === CellState.invisible 
            && bottomLeftCell.value !== CellValue.bomb) {
                if (bottomLeftCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam+1, colParam-1);
                } else {
                    newCells[rowParam+1][colParam-1].state = CellState.visible;
            }
        }

        if (bottomCell?.state === CellState.invisible 
            && bottomCell.value !== CellValue.bomb) {
                if (bottomCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam+1, colParam);
                } else {
                    newCells[rowParam+1][colParam].state = CellState.visible;
            }
        }

        if (bottomRightCell?.state === CellState.invisible 
            && bottomRightCell.value !== CellValue.bomb) {
                if (bottomRightCell.value === CellValue.none) {
                    newCells = openAdjCells(newCells, rowParam+1, colParam+1);
                } else {
                    newCells[rowParam+1][colParam+1].state = CellState.visible;
            }
        }

        return newCells;
};

// export const handleKeyDown = () => {};