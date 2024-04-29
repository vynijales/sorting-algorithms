const algorithmSelect = document.getElementById("algorithm");
const arrayInput = document.getElementById("array");
const sortButton = document.getElementById("sort");
const arrayContainer = document.getElementById("array-container");
const speedInput = document.getElementById("speed");
let isExecuting = false;

let array = [];
let algorithm = algorithmSelect.value;

algorithmSelect.addEventListener("change", (e) => {
    algorithm = e.target.value;
});

arrayInput.addEventListener("input", (e) => {
    array = e.target.value.split(",").map(Number);
});

sortButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (isExecuting) {
        return;
    }

    isExecuting = true;
    inputsController();

    arrayContainer.innerHTML = "";
    array = arrayInput.value.split(",").map(Number);
    const speed = 2000 - speedInput.value * 20;
    visualizeSorting(algorithm, array, 0, speed);
});

// Sorting algorithms

function visualizeSorting(algorithm, array, step, speed) {
    switch (algorithm) {
        case "bubbleSort":
            bubbleSort(array, step, speed);
            break;
        case "insertionSort":
            insertionSort(array, step, speed);
            break;
        case "selectionSort":
            selectionSort(array, step, speed);
            break;
        case "shellSort":
            shellSort(array, step, speed);
            break;
        case "mergeSort":
            mergeSort(array, 0, array.length - 1, speed);
            break;
        case "quickSort":
            quickSort(array, speed);
            break;
    }
}

// Bubble sort

function bubbleSort(array, step, speed = 500) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                visualizeStep(array, j, j + 1);
                step++;
                setTimeout(() => {
                    bubbleSort(array, step, speed);
                }, speed);
                return;
            }
        }
    }
    if (isSorted(array)) {
        isExecuting = false;
        inputsController();
        return;
    }
}

// Insertion sort

function insertionSort(array, step, speed = 500) {
    const n = array.length;
    if (step < n) {
        let key = array[step];
        let j = step - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
        visualizeStep(array, step, j + 1);
        step++;
        setTimeout(() => {
            insertionSort(array, step, speed);
        }, speed);
    }

    if (isSorted(array)) {
        isExecuting = false;
        inputsController();
        return;
    }
}

// Selection sort

function selectionSort(array, step = 0, speed = 500) {
    const n = array.length;
    if (step < n) {
        let minIndex = step;
        for (let j = step + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        swap(array, step, minIndex);
        visualizeStep(array, step, minIndex);
        step++;
        setTimeout(() => {
            selectionSort(array, step, speed);
        }, speed);
    } else if (isSorted(array)) {
        isExecuting = false;
        inputsController();
    }
}

// Shell sort

function shellSort(array, step = 0, gap = 2, speed = 500) {
    const n = array.length;
    gap = gap || Math.floor(n / 2);

    if (gap > 0) {
        if (step < n) {
            let temp = array[step];
            let j = step;
            while (j >= gap && array[j - gap] > temp) {
                array[j] = array[j - gap];
                visualizeStep(array, j, j - gap);
                j -= gap;
            }
            if (j !== step) {
                array[j] = temp;
                visualizeStep(array, j, step);
            }
            setTimeout(() => {
                shellSort(array, step + 1, gap, speed);
            }, speed);

            if (isSorted(array)) {
                isExecuting = false;
                inputsController();
                return;
            }
        } else {
            shellSort(array, 0, Math.floor(gap / 3), speed);
        }
        console.log(array, gap, step);
    }
}

// Merge sort

async function mergeSort(array, start = 0, end = array.length - 1, speed = 500) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(array, start, mid, speed);
        await mergeSort(array, mid + 1, end, speed);
        await merge(array, start, mid, end, speed);
    }

    if (isSorted(array)) {
        isExecuting = false;
        inputsController();
    }
}

function merge(array, start, mid, end, speed) {
    return new Promise((resolve) => {
        const left = array.slice(start, mid + 1);
        const right = array.slice(mid + 1, end + 1);
        let i = 0,
            j = 0,
            k = start;

        const interval = setInterval(() => {
            if (i < left.length && j < right.length) {
                if (left[i] < right[j]) {
                    array[k++] = left[i++];
                } else {
                    array[k++] = right[j++];
                }
            } else if (i < left.length) {
                array[k++] = left[i++];
            } else if (j < right.length) {
                array[k++] = right[j++];
            } else {
                clearInterval(interval);
                visualizeStep(array, start, end);
                resolve();
            }
        }, speed);
    });
}

// Quick sort

async function quickSort(array, speed = 500) {
    let stack = [];
    let low = 0;
    let high = array.length - 1;

    stack.push({ low, high });

    while (stack.length > 0) {
        let { low, high } = stack.pop();

        let pi = await partition(array, low, high, speed);

        if (pi - 1 > low) {
            stack.push({ low, high: pi - 1 });
        }

        if (pi + 1 < high) {
            stack.push({ low: pi + 1, high });
        }

        if (stack.length === 0 && isSorted(array)) {
            isExecuting = false;
            inputsController();
        }
    }
}

function partition(array, low, high, speed) {
    return new Promise(resolve => {
        let pivot = array[high];
        let i = low - 1;

        let interval = setInterval(() => {
            if (low <= high) {
                if (array[low] < pivot) {
                    i++;
                    swap(array, i, low);
                }
                visualizeStep(array, low, high);
                low++;
            } else {
                swap(array, i + 1, high);
                visualizeStep(array, i + 1, high);
                clearInterval(interval);
                resolve(i + 1);
            }
        }, speed);
    });
}

// Utility functions
function inputsController() {
    if (isExecuting) {
        arrayInput.disabled = true;
        algorithmSelect.disabled = true;
        sortButton.disabled = true;
        speedInput.disabled = true;

    } else {
        arrayInput.disabled = false;
        algorithmSelect.disabled = false;
        sortButton.disabled = false;
        speedInput.disabled = false;

        elements = document.getElementsByClassName("array-element");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
        }
    }
}

function isSorted(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i - 1] > array[i]) {
            return false;
        }
    }
    return true;
}

function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function visualizeStep(array, i, j) {
    arrayContainer.innerHTML = "";
    array.forEach((element, index) => {
        const arrayElement = document.createElement("div");
        arrayElement.classList.add("array-element");
        if (index === i || index === j) {
            arrayElement.classList.add("active");
        }
        arrayElement.textContent = element;
        arrayContainer.appendChild(arrayElement);
    });
}