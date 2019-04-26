import React from 'react';
import './App.css';

class App extends React.Component {
    state = {
        matrix: Array.apply(null, Array(16)).map(function (x, i) {
            return Array.apply(null, Array(12)).map((x) => false);
        }),
        row0: '',
        row1: '',
        row2: '',
        row3: '',
    }

    calcMatrix = (dx, dy, maxY)=>{
        let row = '';
        let arr = [];
        for(let y=0;y<maxY;y++) {
            for(let x=0;x<8;x++) {
                arr.push(this.state.matrix[x+dx][y+dy]?1:0);
            }
            let byte = parseInt(arr.reverse().join(''), 2).toString(16);
            if(byte.length===1) {
                byte = '0' + byte;
            }
            row = byte + row;
            arr = [];
        }
        return row;
    }

    click = (x, y) => {
        this.state.matrix[x][y] = !this.state.matrix[x][y];
        this.setState({
            matrix: [...this.state.matrix],
        });


        this.setState({
            row0: this.calcMatrix(0,0, 8),
            row1: this.calcMatrix(8,0, 8),
            row2: this.calcMatrix(0,8, 4),
            row3: this.calcMatrix(8,8, 4),
        })
    };

    cell = (x, y, on) => {
        let matrix = 0;
        let rx = x;
        let ry = y;

        if (x >= 8 && y < 8) {
            matrix = 1;
            rx = x - 8;
        }

        if (x >= 8 && y >= 8) {
            matrix = 3;
            rx = x - 8;
            ry = y - 8;
        }

        if (x < 8 && y >= 8) {
            matrix = 2;
            ry = y - 8;
        }

        return <div key={`${x}:${y}`} className={on ? 'on' : 'off'}
                    onClick={() => this.click(x, y, matrix, rx, ry)}>&nbsp;</div>
    };

    matrix() {
        return Array.apply(null, Array(12)).map((ss, y)=>{
            return (<div className="row">
                {Array.apply(null, Array(16)).map((ss, x) => this.cell(x,y,this.state.matrix[x][y]))}
            </div>);
        })
    }

    render() {
        return <div className="App">
            <div className="big">
                {this.matrix()}
            </div>
            <div className="eyes">
                <div className="small reverse">
                    {this.matrix()}
                </div>
                <div className="small ">
                    {this.matrix()}
                </div>
            </div>
            <pre style={{color: 'white'}}>
                0x{this.state.row0},<br/>
                0x{this.state.row1},<br/>
                0x{this.state.row2},<br/>
                0x{this.state.row3},<br/>
            </pre>
        </div>
    }
}


export default App;
