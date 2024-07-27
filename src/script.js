let array = [];
const arraySize = 30;
let delay = 100; // Delay in ms for visualization

const timeComplexities = {
    'bubble': 'O(n^2)',
    'insertion': 'O(n^2)',
    'selection': 'O(n^2)',
    'merge': 'O(n log n)',
    'quick': 'Best: O(n log n), Avg: O(n log n), Worst: O(n^2)'
};

function generateArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray();
    updateTimeComplexity();
}

function displayArray() {
    const arrayContainer = document.getElementById('array-container');
    arrayContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = `${array[i]}%`;
        bar.classList.add('array-bar');
        arrayContainer.appendChild(bar);
    }
}

function updateTimeComplexity() {
    const algorithm = document.getElementById('algorithm').value;
    const complexity = timeComplexities[algorithm];
    document.getElementById('time-complexity').innerText = complexity;
}

function updateSpeed() {
    const speed = document.getElementById('speed').value;
    delay = 100 - speed;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sortArray() {
    const algorithm = document.getElementById('algorithm').value;
    switch (algorithm) {
        case 'bubble':
            await bubbleSort(array);
            break;
        case 'insertion':
            await insertionSort(array);
            break;
        case 'selection':
            await selectionSort(array);
            break;
        case 'merge':
            await mergeSort(array, 0, array.length - 1);
            break;
        case 'quick':
            await quickSort(array, 0, array.length - 1);
            break;
    }
    displayArray();
}

// Sorting algorithms

async function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            highlightBars(j, j+1, 'compared');
            if (arr[j] > arr[j+1]) {
                await swap(arr, j, j+1);
            }
            removeHighlight(j, j+1);
        }
        markSorted(n-i-1);
    }
}

async function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            highlightBars(j, j+1, 'compared');
            arr[j + 1] = arr[j];
            j = j - 1;
            displayArray();
            await sleep(delay);
            removeHighlight(j+1, j+2);
        }
        arr[j + 1] = key;
        displayArray();
        await sleep(delay);
    }
    markSortedRange(0, n-1);
}

async function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n-1; i++) {
        let min_idx = i;
        for (let j = i+1; j < n; j++) {
            highlightBars(min_idx, j, 'compared');
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
            removeHighlight(min_idx, j);
        }
        await swap(arr, min_idx, i);
        markSorted(i);
    }
    markSortedRange(0, n-1);
}

async function mergeSort(arr, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const left = Array(n1);
    const right = Array(n2);
    for (let i = 0; i < n1; i++) left[i] = arr[l + i];
    for (let j = 0; j < n2; j++) right[j] = arr[m + 1 + j];
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        highlightBars(l + i, m + 1 + j, 'compared');
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
        displayArray();
        await sleep(delay);
        removeHighlight(l + i - 1, m + j);
    }
    while (i < n1) arr[k++] = left[i++];
    while (j < n2) arr[k++] = right[j++];
    displayArray();
    await sleep(delay);
    markSortedRange(l, r);
}

async function quickSort(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = (low - 1);
    for (let j = low; j <= high - 1; j++) {
        highlightBars(j, high, 'compared');
        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j);
        }
        removeHighlight(j, high);
    }
    await swap(arr, i + 1, high);
    return (i + 1);
}

async function swap(arr, i, j) {
    highlightBars(i, j, 'swap-phase1');
    await sleep(delay);
    highlightBars(i, j, 'swap-phase2');
    await sleep(delay);
    highlightBars(i, j, 'swap-phase3');
    await sleep(delay);
    highlightBars(i, j, 'swap-phase4');
    [arr[i], arr[j]] = [arr[j], arr[i]];
    displayArray();
    await sleep(delay);
    removeHighlight(i, j);
}

function highlightBars(index1, index2, className) {
    const bars = document.getElementsByClassName('array-bar');
    bars[index1].classList.add(className);
    bars[index2].classList.add(className);
}

function removeHighlight(index1, index2) {
    const bars = document.getElementsByClassName('array-bar');
    bars[index1].classList.remove('compared', 'swapped', 'swap-phase1', 'swap-phase2', 'swap-phase3', 'swap-phase4');
    bars[index2].classList.remove('compared', 'swapped', 'swap-phase1', 'swap-phase2', 'swap-phase3', 'swap-phase4');
}

function markSorted(index) {
    const bars = document.getElementsByClassName('array-bar');
    bars[index].classList.add('sorted');
}

function markSortedRange(start, end) {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = start; i <= end; i++) {
        bars[i].classList.add('sorted');
    }
}

generateArray();
