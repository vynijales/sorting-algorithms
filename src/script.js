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

    simulacaoText = document.getElementById("simulacao");
    simulacaoText.style.display = "block";

    arrayContainer.innerHTML = "";

    array = arrayInput.value.split(",").map(Number);
    const speed = 2000 - speedInput.value * 20;
    visualizeSorting(algorithm, array, 0, speed);
});

// Sorting algorithms

function visualizeSorting(algorithm, array, step, speed) {
    visualizeStep(array, null, null);
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

function shellSort(array, speed = 500) {
    let size = array.length;
    let h = 1;
    while (h < size / 3) {
        h = 3 * h + 1;
    }

    while (h >= 1) {
        for (let i = h; i < size; i++) {
            for (let j = i; j >= h && array[j] < array[j - h]; j -= h) {
                swap(array, j, j - h);
                visualizeStep(array, j, j - h, speed);
            }
        }
        h = Math.floor(h / 3);
    }

    if (isSorted(array)) {
        isExecuting = false;
        inputsController();
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
    // arrayContainer.innerHTML = "";
    // Quebra de linha
    const br = document.createElement("br");
    arrayContainer.appendChild(br);
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

// Legenda

const description = document.getElementById("description");

function getAlgorithmDescription(algorithm) {
    switch (algorithm) {
        case "bubbleSort":
            return "Itera sobre a lista, comparando elementos adjacentes e trocando-os se estiverem fora de ordem, repetindo esse processo até que a lista esteja ordenada. A complexidade no pior caso é O(n^2), no caso médio é O(n^2) e no melhor caso é O(n).";
        case "insertionSort":
            return "Constrói a lista ordenada um elemento por vez, inserindo cada novo elemento na posição correta comparando com os elementos já ordenados. A complexidade no pior caso é O(n^2), no caso médio é O(n^2) e no melhor caso é O(n).";
        case "selectionSort":
            return "Encontra repetidamente o menor elemento da lista não ordenada e o move para a posição correta na lista ordenada, mantendo duas sub-listas: uma ordenada e outra não. A complexidade no pior caso é O(n^2), no caso médio é O(n^2) e no melhor caso é O(n^2).";
        case "shellSort":
            return "Uma extensão do Insertion Sort que divide a lista em sublistas menores e aplica o Insertion Sort a cada sublista, utilizando uma sequência de gaps para determinar quais elementos são comparados e trocados. A complexidade no pior caso é O(n^2), no caso médio é dependente da sequência de gaps utilizada e no melhor caso é O(n log n).";
        case "mergeSort":
            return "Utiliza a estratégia de dividir e conquistar, dividindo a lista ao meio de forma equilibrada, recursivamente ordenando as sublistas e mesclando as sublistas ordenadas para obter a lista final ordenada. A complexidade no pior caso é O(n log n), no caso médio é O(n log n) e no melhor caso é O(n log n).";
        case "quickSort":
            return "Utiliza a estratégia de dividir e conquistar, selecionando um pivô, rearranjando os elementos de forma que os menores estejam à esquerda e os maiores à direita do pivô, e então recursivamente ordenando as sublistas menores. A complexidade no pior caso é O(n^2), no caso médio é O(n log n) e no melhor caso é O(n log n).";
        default:
            return "";
    }
}

function handleAlgorithmChange(e) {
    const algorithm = e.target.value;
    console.log(algorithm);
    const algorithmDescription = getAlgorithmDescription(algorithm);
    description.textContent = algorithmDescription;
    arrayContainer.innerHTML = "";
    simulacaoText = document.getElementById("simulacao");
    // Display none quando mudar o algoritmo 
    simulacaoText.style.display = "none";
}

algorithmSelect.addEventListener("change", handleAlgorithmChange);

// Ao iniciar a página chamar a função handleAlgorithmChange
(function initializePage() {
    const algorithm = algorithmSelect.value;
    const algorithmDescription = getAlgorithmDescription(algorithm);
    description.textContent = algorithmDescription;
})();