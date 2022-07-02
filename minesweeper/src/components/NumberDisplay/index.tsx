import React from "react";

import "./NumberDisplay.scss"

interface NumberDisplayPros {
    value: number,
}

const NumberDisplay: React.FC<NumberDisplayPros> = ({value}) => {
    return <div className="NumberDisplay">{value.toString().padStart(3, '0')}</div>
}

export default NumberDisplay;