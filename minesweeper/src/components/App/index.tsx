import React, { useEffect, useState} from "react";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../utils";
import Button from "../Button";

import "./App.scss";
import { Cell, Face, CellState } from '../types/index';
import { BOMBS } from "../constants";

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(BOMBS);

    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.confuse);
        };

        const handleMouseUp = (): void => {
            setFace(Face.smile);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (live && time < 999) {
            const timer = setInterval(() => {setTime(time+1)}, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [live, time]);

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        //console.log(rowParam, colParam);

        // start game 
        if (!live) {
            setLive(true);
        }
    };

    const handleCellContext = (
            rowParam: number, 
            colParam: number
        ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();

        // if game is not started, can't place any flags on the board 
        if (!live) {
            return;
        }
        
        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam];

        if (currentCell.state === CellState.visible) {
            return;
        } else if (currentCell.state === CellState.invisible) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            setCells(currentCells);
            setBombCounter(bombCounter - 1);
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.invisible;
            setCells(currentCells);
            setBombCounter(bombCounter + 1);
        }
    };

    const handleFaceClick = (): void => {
        if (live) {
            setLive(false);
            setTime(0);
            setCells(generateCells());
        }
    };

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
            <Button key={`${rowIndex}-${colIndex}`} 
                    state={cell.state} 
                    value={cell.value} 
                    onClick={handleCellClick}
                    onContext={handleCellContext}
                    row={rowIndex} 
                    col={colIndex}
                    />
                )
            )
        );
    };

    return(
        <div className="App">
            <div className="Header">
                <NumberDisplay value={bombCounter} />
                <div className="Face" onClick={handleFaceClick}>
                    <span role="img" aria-label="face">
                        { face }
                    </span>
                </div>
                <NumberDisplay value={time} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    );
};

export default App;