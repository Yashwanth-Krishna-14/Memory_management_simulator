import React, { useState } from 'react';
import './App.css';

function App() {
    const [memory, setMemory] = useState(Array(10).fill(null));
    const [processId, setProcessId] = useState('');
    const [blockSize, setBlockSize] = useState(1);
    const [totalMemory, setTotalMemory] = useState(10);
    const [processes, setProcesses] = useState([]);

    const handleMemoryChange = () => {
        setMemory(Array(totalMemory).fill(null));
        setProcesses([]); // Reset processes when memory size changes
        setProcessId(''); // Clear process ID
        setBlockSize(1); // Reset block size
    };

    const allocateMemory = (strategy) => {
        const size = parseInt(blockSize);
        if (isNaN(size) || size <=0) return alert('Please enter a valid block size.');

        const newMemory = [...memory];

        if (strategy === 'first') {
            for (let i = 0; i < totalMemory; i++) {
                if (newMemory[i] === null && i + size <= totalMemory) {
                    let canAllocate = true;
                    for (let j = i; j < i + size; j++) {
                        if (newMemory[j] !== null) {
                            canAllocate = false;
                            break;
                        }
                    }
                    if (canAllocate) {
                        for (let j = i; j < i + size; j++) {
                            newMemory[j] = processId;
                        }
                        setProcesses([...processes, processId]);
                        setMemory(newMemory);
                        return;
                    }
                }
            }
        } else if (strategy === 'best') {
            let bestIndex = -1;
            let bestSize = totalMemory + 1;

            for (let i = 0; i < totalMemory; i++) {
                if (newMemory[i] === null) {
                    let currentSize = 0;
                    while (i + currentSize < totalMemory && newMemory[i + currentSize] === null) {
                        currentSize++;
                    }
                    if (currentSize >= size && currentSize < bestSize) {
                        bestSize = currentSize;
                        bestIndex = i;
                    }
                    i += currentSize; // Skip to the end of the empty block
                }
            }

            if (bestIndex !== -1) {
                for (let j = bestIndex; j < bestIndex + size; j++) {
                    newMemory[j] = processId;
                }
                setProcesses([...processes, processId]);
                setMemory(newMemory);
                return;
            }
        } else if (strategy === 'worst') {
            let worstIndex = -1;
            let worstSize = -1;

            for (let i = 0; i < totalMemory; i++) {
                if (newMemory[i] === null) {
                    let currentSize = 0;
                    while (i + currentSize < totalMemory && newMemory[i + currentSize] === null) {
                        currentSize++;
                    }
                    if (currentSize >= size && currentSize > worstSize) {
                        worstSize = currentSize;
                        worstIndex = i;
                    }
                    i += currentSize; // Skip to the end of the empty block
                }
            }

            if (worstIndex !== -1) {
                for (let j = worstIndex; j < worstIndex + size; j++) {
                    newMemory[j] = processId;
                }
                setProcesses([...processes, processId]);
                setMemory(newMemory);
                return;
            }
        }

        alert('Not enough memory available!');
    };

    const deallocateMemory = () => {
        const newMemory = [...memory];
        for (let i = 0; i < totalMemory; i++) {
            if (newMemory[i] === processId) {
                newMemory[i] = null;
            }
        }
        setProcesses(processes.filter(proc => proc !== processId));
        setMemory(newMemory);
        alert(`Deallocated memory for Process ID ${processId}`);
        setProcessId(''); // Clear Process ID after deallocation
        setBlockSize(1); // Reset block size after deallocation
    };

    const calculateFragmentation = () => {
        let totalFreeSpace = memory.filter(block => block === null).length;
        let totalAllocatedSpace = memory.length - totalFreeSpace;

        const internalFragmentation = totalAllocatedSpace % blockSize || "N/A";
        const externalFragmentation = totalFreeSpace;

        return { internalFragmentation, externalFragmentation };
    };

    const { internalFragmentation, externalFragmentation } = calculateFragmentation();

    return (
        <div className="App">
            <h1>Enhanced Memory Management Simulator</h1>

            {/* Total Memory Size Input */}
            <div>
                <input
                    type="number"
                    placeholder="Total Memory Size"
                    value={totalMemory}
                    onChange={(e) => setTotalMemory(e.target.value)}
                />
                <button onClick={handleMemoryChange}>Set Memory Size</button>
            </div>

            {/* Process ID and Block Size Inputs */}
            <div>
                <input
                    type="text"
                    placeholder="Process ID"
                    value={processId}
                    onChange={(e) => setProcessId(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Block Size"
                    value={blockSize}
                    onChange={(e) => setBlockSize(e.target.value)}
                />
            </div>

            {/* Allocation Strategy Buttons */}
            <div>
                <div className="tooltip">
                  <button onClick={() => allocateMemory('first')}>Allocate First Fit</button>
                  <span className="tooltiptext">Allocates memory using First Fit strategy</span>
                </div>
                
                <div className="tooltip">
                  <button onClick={() => allocateMemory('best')}>Allocate Best Fit</button>
                  <span className="tooltiptext">Allocates memory using Best Fit strategy</span>
                </div>
                
                <div className="tooltip">
                  <button onClick={() => allocateMemory('worst')}>Allocate Worst Fit</button>
                  <span className="tooltiptext">Allocates memory using Worst Fit strategy</span>
                </div>
                
                <div className="tooltip">
                  <button onClick={deallocateMemory} disabled={!processId}>Deallocate Memory</button>
                  <span className="tooltiptext">Deallocates memory for the specified Process ID</span>
                </div>
            </div>

            {/* Memory Visualization */}
            <div className="memory">
                {memory.map((block, index) => (
                    <div key={index} className={`memory-block ${block ? 'allocated' : 'free'}`}>
                        {block ? block : 'Free'}
                    </div>
                ))}
            </div>

            {/* Fragmentation Info */}
            <div>
                <h2>Fragmentation</h2>
                <p>Internal Fragmentation: {internalFragmentation}</p>
                <p>External Fragmentation: {externalFragmentation}</p>
            </div>

            {/* Active Processes List */}
            <div>
                <h2>Active Processes</h2>
                {processes.length >0 ? (
                  <ul>
                      {processes.map((proc, index) => (
                          <li key={index}>{proc}</li>
                      ))}
                  </ul>) : (<p>No active processes.</p>)}
                
            </div>

        </div>
    );
}

export default App;
