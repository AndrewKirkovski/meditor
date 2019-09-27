/* global BigInt */
import React from 'react';
import './App.css';
import Layer from "./Layer";

class App extends React.Component {

    render() {
        return <>
            <div className="layers">
                <Layer/>
                <Layer/>
                <Layer/>
            </div>
        </>
    }
}


export default App;
