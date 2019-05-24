/* global BigInt */
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

    componentWillMount() {
        document.addEventListener("keydown", (event)=>{
            console.log(event);
            if(event.keyCode === 37){
                this.shiftLeft();
            }
            if(event.keyCode === 39){
                this.shiftRight();
            }
            if(event.keyCode === 38){
                this.shiftTop();
            }
            if(event.keyCode === 40){
                this.shiftDown();
            }
        }, false);
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

    shiftLeft() {
        this.setState({
            matrix: this.state.matrix.map((column, x) => this.state.matrix[(x + 1) % 16]),
        });
        this.setState({
            row0: this.calcMatrix(0,0, 8),
            row1: this.calcMatrix(8,0, 8),
            row2: this.calcMatrix(0,8, 4),
            row3: this.calcMatrix(8,8, 4),
        })
    }

    shiftRight() {
        this.setState({
            matrix: this.state.matrix.map((column, x) => this.state.matrix[(x + 15) % 16]),
        });
        this.setState({
            row0: this.calcMatrix(0,0, 8),
            row1: this.calcMatrix(8,0, 8),
            row2: this.calcMatrix(0,8, 4),
            row3: this.calcMatrix(8,8, 4),
        })
    }

    shiftTop() {
        this.setState({
            matrix: this.state.matrix.map((column, x) => column.map((val, y) => column[(y + 1) % 12])),
        });
        this.setState({
            row0: this.calcMatrix(0,0, 8),
            row1: this.calcMatrix(8,0, 8),
            row2: this.calcMatrix(0,8, 4),
            row3: this.calcMatrix(8,8, 4),
        })
    }

    shiftDown() {
        this.setState({
            matrix: this.state.matrix.map((column, x) => column.map((val, y) => column[(y + 11) % 12])),
        });
        this.setState({
            row0: this.calcMatrix(0,0, 8),
            row1: this.calcMatrix(8,0, 8),
            row2: this.calcMatrix(0,8, 4),
            row3: this.calcMatrix(8,8, 4),
        })
    }

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

    handleFocus = (e) => {
        e.currentTarget.select();
    };

    handleClick = (e)=>{
        e.currentTarget.focus();
        e.currentTarget.select();
    };

    handleChange = (e)=>{
        const value = e.currentTarget.value.split('\n').join('').split(',');
        try {
            // console.log(value, value.map(v=>BigInt('0x'+v).toString(16)))
            const matrixes = value.map(v=>BigInt(v.trim()).toString(2));
            const matrix = Array.apply(null, Array(16)).map(function (hhh, x) {
                return Array.apply(null, Array(12)).map((dsffd, y) => {
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
                    const target = (matrix > 1 ? 32 : 64);
                    while(matrixes[matrix].length < target) {
                        matrixes[matrix] = '0' + matrixes[matrix];
                    }
                    const shift = (target-1) - (ry * 8 + rx);
                    console.log(shift, rx, ry, matrixes[matrix].charAt(shift), matrixes[matrix], matrixes[matrix].length);
                    return matrixes[matrix][shift] === '1';
                });
            });
            this.setState({
                matrix,
            });

            this.setState({
                row0: this.calcMatrix(0,0, 8),
                row1: this.calcMatrix(8,0, 8),
                row2: this.calcMatrix(0,8, 4),
                row3: this.calcMatrix(8,8, 4),
            });
            // console.log(matrix);
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        console.log(this.state);
        const value = `0x${this.state.row0},
0x${this.state.row1},
0x${this.state.row2},
0x${this.state.row3}`;

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
            <textarea style={{height: '80px'}}value={value} onClick={this.handleClick} onChange={this.handleChange}></textarea>
        </div>
    }
}


export default App;
